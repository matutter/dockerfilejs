var ins = require('../test.js').instruction
var assert = require('chai').assert

const simple = {
  key : 'val'
}

const simple_w_space = {
  key : 'val 1'
}


const simple_multi = {
  key1: 'val1',
  key2: 'val 2'
}

const complex = {
  key : 'val',
  nested : { object : {
    key: 'val'
  }}
}

describe('testing instruction env', ()=> {

  describe('with an object of depth 1', ()=> {
    const expect = 'ENV key=val'
    it('should produce ' + expect, ()=> {
      const result = ins.env(simple)
      assert.equal(result, expect)
    })
  })

  describe('with the obbuild flag set true, env(..., true)', ()=> {
    const expect = 'ONBUILD ENV key=val'
    it('should produce ' + expect, ()=> {
      const result = ins.env(simple, true)
      assert.equal(result, expect)
    })
  })

  describe('with whitespace in the value', ()=> {
    const expect = 'ENV key="val 1"'
    it('should enquote the value, producing ' + expect, ()=> {
      const result = ins.env(simple_w_space)
      assert.equal(result, expect)
    })
  })

  describe('with multiple own-properties', ()=> {
    const expect = `ENV key1=val1 \\\n    key2="val 2"`
    it('should enquote the value, producing ' + expect, ()=> {
      const result = ins.env(simple_multi)
      assert.equal(result, expect)
    })
  })

  describe('with a complex object of depth n+1', ()=> {
    const expect = `ENV key=val \\\n    nested.object.key=val`
    it('should enquote the value, producing ' + expect, ()=> {
      const result = ins.env(complex)
      assert.equal(result, expect)
    })
  })

  describe('for invalid input', ()=> {
    it('should throw on object with no own-properties', ()=> {
      assert.throws(() => { ins.env({}) })
    })

    it('should throw when a properties value is null', ()=> {
      assert.throws(() => { ins.env({key: null}) })
    })

    it('should throw when input is null', ()=> {
      assert.throws(() => { ins.env(null) })
      assert.throws(() => { ins.env() })
    })
  })
})