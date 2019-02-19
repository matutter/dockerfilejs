const instruction = require('./lib/instruction.js')
const model = require('./lib/model.js')

function InstructionWrap(name, data, on_build_flag, fn) {
  this.name = name
  this.data = data
  this.on_build_flag = on_build_flag
  this.fn = fn
}

function Dockerfile() {
  var steps = []
  this.stages = [this]
  this._current_stage = 0
  this._separator = '\n\n'
  this.steps = () => steps
  this.append = (step) => {
    this.getStage().steps().push(step);
    return this
  }
  this.prepend = (step) => {
    this.getStage().steps().unshift(step);
    return this
  }
  this.splice = (start, step) => {
    this.getStage().steps().splice(start, 0, step)
    return this
  }
}
Object.keys(instruction).forEach(name => {
  const fn = instruction[name]
  if(name == 'from') {
    Dockerfile.prototype[name] = function(data, on_build_flag) {
      var from = new InstructionWrap(name, data, on_build_flag, fn)
      var start = this.steps().findIndex(step => step.name != 'comment')
      this.splice(start, from)
      return this
    }
  } else {
    Dockerfile.prototype[name] = function(data, on_build_flag) {
      this.append(new InstructionWrap(name, data, on_build_flag, fn))
      return this
    }
  }
})

/** set step / section separator */
Dockerfile.prototype.separator = function(separator) {
  this.stages.forEach(stage => stage._separator = separator);
  return this
};

Dockerfile.prototype.renderSteps = function() {
  // unused parameter
  return this
    .steps()
    .map(step => step.fn(step.data, step.on_build_flag).trim())
};

Dockerfile.prototype.render = function(steps) {
  return this.stages.map(stage => {
    return stage.renderSteps(steps).join(this._separator || '\n')
  }).join(this._separator || '\n')
};

Dockerfile.prototype.stage = function(stage) {
  if (stage) {
    // Rely on index error ...
    var _ = this.stages[stage];
  } else {
    var df = new Dockerfile();
    // TODO: this is fine for now - there are few things to copy
    df.separator(this._separator);
    stage = this.stages.push(df) - 1;
  }

  // _current_stage == null is the same as make "this" one active
  this._current_stage = stage;

  return this;
}

Dockerfile.prototype.getStage = function() {
  return this.stages[this._current_stage];
}

module.exports.Dockerfile = Dockerfile
module.exports.instruction = instruction
module.exports.model = model
