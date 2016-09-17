var ins = require('../test.js').instruction
var assert = require('chai').assert

describe('testing instruction "CMD"', ()=> {

  describe('the command form of {command: "echo", params: ["hello world"]}', () => {
    it('should produce: CMD echo "hello world"', () => {
      const expect = 'CMD echo "hello world"'
      const result = ins.cmd({command: 'echo', params: ["hello world"]})
      assert.equal(expect, result)
    })
    it('should produce CMD ... without params', () => {
      const expect = 'CMD echo "hello world"'
      const result = ins.cmd({command: 'echo "hello world"'})
      assert.equal(expect, result)
    })
  })

  describe('the exec form of {executable: "echo", params: ["hello world"]}', () => {
    it('should produce: CMD ["echo", "hello world"]', () => {
      const expect = 'CMD ["echo", "hello world"]'
      const result = ins.cmd({executable: 'echo', params: ["hello world"]})
      assert.equal(expect, result)
    })
    it('should produce CMD [...] without params', () => {
      const expect = 'CMD ["echo"]'
      const result = ins.cmd({executable: 'echo'})
      assert.equal(expect, result)
    })
  })

  describe('the exec form of {params: ["echo", "hello world"]}', () => {
    it('should produce: CMD ["echo", "hello world"]', () => {
      const expect = 'CMD ["echo", "hello world"]'
      const result = ins.cmd({params: ['echo', "hello world"]})
      assert.equal(expect, result)
    })
  })

  describe('on invalid input', () => {
    it('should throw on null or empty input', () => {
      assert.throws( () => ins.cmd({}) )
      assert.throws( () => ins.cmd('') )
      assert.throws( () => ins.cmd('asdd') )
      assert.throws( () => ins.cmd() )
      assert.throws( () => ins.cmd(null) )
    })
    it('should throw if "command" and "executable" are used', () => {
      assert.throws( () => ins.cmd({ command : 'c', executable: 'e'}) )
    })
  })

})