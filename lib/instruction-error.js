'use strict';

module.exports.InstructionError = InstructionError;
module.exports.MissingPropertyError = MissingPropertyError;
module.exports.EmptyArrayError = EmptyArrayError;
module.exports.EmptyStringError = EmptyStringError;
module.exports.PropertyConflictError = PropertyConflictError;

const util = require('util');
const fmt = util.format;
const inherits = util.inherits;

function InstructionError(instruction, message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.instruction = instruction.toUpperCase();
  this.message = fmt('Instruction "%s" %s', this.instruction, message);
};
inherits(InstructionError, Error)

function MissingPropertyError(instruction, property, found) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.instruction = instruction.toUpperCase();
  this.message = fmt('Instruction "%s" expected property "%s", found %s', this.instruction, property, found);
};
inherits(MissingPropertyError, Error)

function EmptyArrayError(instruction, property) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.instruction = instruction.toUpperCase();
  this.message = fmt('Instruction "%s" expected array property "%s" of length 1 or more', this.instruction, property);
};
inherits(EmptyArrayError, Error)

function EmptyStringError(instruction, property) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.instruction = instruction.toUpperCase();
  this.message = fmt('Instruction "%s" expected property "%s", found [EMPTY STRING]', this.instruction, property);
};
inherits(EmptyStringError, Error)

function PropertyConflictError(instruction, props) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.instruction = instruction.toUpperCase();
  this.message = fmt('Instruction "%s" encountered conflicting properties: %s', this.instruction, props.join(', '));
};
inherits(PropertyConflictError, Error)
