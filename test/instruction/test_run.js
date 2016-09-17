var ins = require('../test.js').instruction
var assert = require('chai').assert

describe('testing instruction "RUN"', ()=> {

  describe('with string parameter', () => {
    it('should produce: RUN echo "some command string"', () => {
      const expect = 'RUN echo "some command string"'
      const result = ins.run('echo "some command string"')
      assert.equal(expect, result)
    })
  })

  describe('with on object of the form: { command: ... }', () => {
    it("should take a single string", () => {
      const expect = 'RUN touch /file.txt'
      const result = ins.run({command: 'touch /file.txt'})
      assert.equal(expect, result)
    })
    it("should take an array of strings as multiple commands", () => {
      const expect = 'RUN touch /file.txt \\\n' +
                     '  && echo test >> /file.txt'
      const result = ins.run({command: ['touch /file.txt', "echo test >> /file.txt"]})
      assert.equal(expect, result)
    })
    it("should take an array of strings or array(s) of strings as multiple commands", () => {
      const expect = 'RUN touch /file.txt \\\n' +
                     '  && echo "hello world" >> /file.txt'
      const result = ins.run({command: ['touch /file.txt', ['echo', 'hello world', '>>', '/file.txt']]})
      assert.equal(expect, result)
    })
  })

  describe('on invalid input', () => {
    it('should throw on null or empty input', () => {
      assert.throws( () => ins.run({}) )
      assert.throws( () => ins.run('') )
      assert.throws( () => ins.run() )
      assert.throws( () => ins.run(null) )
    })
  })

})