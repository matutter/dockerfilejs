'use strict';

const fmt = require('util').format

module.exports.InstructionError = function InstructionError(instruction, message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.instruction = instruction.toUpperCase();
  this.message = fmt('Instruction "%s" %s', this.instruction, message);
};

module.exports.MissingPropertyError = function MissingPropertyError(instruction, property, found) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.instruction = instruction.toUpperCase();
  this.message = fmt('Instruction "%s" expected property "%s", found %s', this.instruction, property, found);
};

module.exports.EmptyArrayError = function EmptyArrayError(instruction, property) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.instruction = instruction.toUpperCase();
  this.message = fmt('Instruction "%s" expected array property "%s" of length 1 or more', this.instruction, property);
};

module.exports.EmptyStringError = function EmptyStringError(instruction, property) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.instruction = instruction.toUpperCase();
  this.message = fmt('Instruction "%s" expected property "%s", found [EMPTY STRING]', this.instruction, property);
};

module.exports.PropertyConflictError = function PropertyConflictError(instruction, props) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.instruction = instruction.toUpperCase();
  this.message = fmt('Instruction "%s" encountered conflicting properties: %s', this.instruction, props.join(', '));
};

require('util').inherits(module.exports, Error);