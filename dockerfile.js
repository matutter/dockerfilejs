const instruction = require('./bin/instruction.js')
const model = require('./bin/model.js')

function InstructionWrap(name, data, on_build_flag, fn) {
  this.name = name
  this.data = data
  this.on_build_flag = on_build_flag
  this.fn = fn
}

function DockerfileAppend(ref) {
  this.end = () => ref
}

Object.keys(instruction).forEach(name => {
  const fn = instruction[name]
  if(name == 'from') {
    DockerfileAppend.prototype[name] = function(data, on_build_flag) {
      this.end().prependStep(new InstructionWrap(name, data, on_build_flag, fn))
      return this
    }
  } else {
    DockerfileAppend.prototype[name] = function(data, on_build_flag) {
      this.end().appendStep(new InstructionWrap(name, data, on_build_flag, fn))
      return this
    }
  }
})

function Dockerfile() {
  var steps = []
  this._separator = '\n\n'
  this.append = new DockerfileAppend(this)
  this.steps = () => steps
  this.appendStep = (step) => {
    steps.push(step);
    return this
  }
  this.prependStep = (step) => {
    steps.unshift(step);
    return this
  }
}

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