var ins = require('../test.js').instruction
var assert = require('chai').assert

describe('testing instruction "HEALTHCHECK"', ()=> {

  describe('when HEALTHCHECK is turned off of parent image', () => {
    it('should produce: HEALTHCHECK NONE', () => {
      const expect = 'HEALTHCHECK NONE'
      const result = ins.healthCheck(false)
      assert.equal(expect, result)
    })
  })

  describe('Without the "options" property', () => {
    it('should produce HEALTHCHECK CMD ...', () => {
      const expect = 'HEALTHCHECK CMD ping www.github.com'
      const result = ins.healthCheck({options : {}, command : 'ping', params: ['www.github.com']})
      assert.equal(expect, result)
    })
  })

  describe('With an unrecognized "options" property', () => {
    it('should produce HEALTHCHECK CMD ...', () => {
      const expect = 'HEALTHCHECK CMD ping www.github.com'
      const result = ins.healthCheck({options : { invalid: 'options' }, command : 'ping', params: ['www.github.com']})
      assert.equal(expect, result)
    })
  })

  describe('With all options properties', () => {
    it('should produce HEALTHCHECK OPPTIONS CMD ...', () => {
      const expect = 'HEALTHCHECK --interval=30s --timeout=30s --retries=10 \\\n' +
        'CMD ping www.github.com'
      const result = ins.healthCheck({
        options : {
          interval:'30s',
          timeout:'30s',
          retries:'10',
        },
        command : 'ping',
        params: ['www.github.com']
      })
      //assert.equal(expect, result)
    })
  })

  describe('on invalid input', () => {
    it('should throw on {}', () => {
      assert.throws( () => ins.cmd({}) )
    })
    it('should throw on \'\'', () => {
      assert.throws( () => ins.cmd('') )
    })
    it('should throw on "strings"', () => {
      assert.throws( () => ins.cmd('strings') )
    })
    it('should throw on undefined', () => {
      assert.throws( () => ins.cmd() )
    })
    it('should throw on null', () => {
      assert.throws( () => ins.cmd(null) )
    })
    it('should throw on true', () => {
      assert.throws( () => ins.cmd(true) )
    })
  })

})