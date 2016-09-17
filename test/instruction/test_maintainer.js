var ins = require('../test.js').instruction
var assert = require('chai').assert


describe('testing instruction "MAINTAINER"', ()=> {

  describe('instruction.maintainer("mat")', ()=> {
    const expect = 'MAINTAINER mat'
    it('should produce ' + expect, ()=> {
      const result = ins.maintainer("mat")
      assert.equal(result, expect)
    })
  })

  describe('instruction.maintainer({name:"mat"})', ()=> {
    const expect = 'MAINTAINER mat'
    it('should produce ' + expect, ()=> {
      const result = ins.maintainer({name:"mat"})
      assert.equal(result, expect)
    })
  })

  describe('on invalid input', ()=> {
    it('should throw on empty strings or falsy values', ()=> {
      assert.throws(() => { ins.maintainer() })
      assert.throws(() => { ins.maintainer('') })
      assert.throws(() => { ins.maintainer(null) })
      assert.throws(() => { ins.maintainer(false) })
      assert.throws(() => { ins.maintainer(undefined) })
      assert.throws(() => { ins.maintainer({name: ''}) })
      assert.throws(() => { ins.maintainer({name: false}) })
    })
  })

})