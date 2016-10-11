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
  this._separator = '\n\n'
  this.steps = () => steps
  this.append = (step) => {
    steps.push(step);
    return this
  }
  this.prepend = (step) => {
    steps.unshift(step);
    return this
  }
  this.splice = (start, step) => {
    steps.splice(start, 0, step)
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
  this._separator = separator
  return this
};

Dockerfile.prototype.renderSteps = function(steps) {
  // unused parameter
  return this
    .steps()
    .map(step => step.fn(step.data, step.on_build_flag).trim())
};

Dockerfile.prototype.render = function(steps) {
  return this.renderSteps(steps).join(this._separator || '\n')
};

module.exports.Dockerfile = Dockerfile
module.exports.instruction = instruction
module.exports.model = model
