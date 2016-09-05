var ins = require('../test.js').instruction
var assert = require('chai').assert

describe('testing instruction add', ()=> {

  describe('with a valid string for the src and dest properties', ()=> {
    const expect = 'ADD ["src", "dest"]'
    it('should produce ' + expect, ()=> {
      const result = ins.add({src: 'src', dest: 'dest'})
      assert.equal(result, expect)
    })
  })

  describe('with an array of sources', ()=> {
    const expect = 'ADD ["src1", "src2", "src3", "dest"]'
    it('should produce ' + expect, ()=> {
      const result = ins.add({src: ['src1', 'src2', 'src3'], dest: 'dest'})
      assert.equal(result, expect)
    })
  })

  describe('with the onbuild parameter set to true run(..., true)', ()=> {
    const expect = 'ONBUILD ADD ["src1", "src2", "src3", "dest"]'
    it('should produce '+expect, ()=> {
      const result = ins.add({src: ['src1', 'src2', 'src3'], dest: 'dest'}, true)
      assert.equal(result, expect)
    })
  })

  describe('for invalid input', ()=> {
    it('should throw on either null', ()=> {
      assert.throws(() => { ins.add({src: null, dest:null}) })
      assert.throws(() => { ins.add({src: 'src', dest:null}) })
      assert.throws(() => { ins.add({src: null, dest:'dest'}) })
    })

    it('should throw on either empty', ()=> {
      assert.throws(() => { ins.add({src: '', dest:''}) })
      assert.throws(() => { ins.add({src: '', dest:'dest'}) })
      assert.throws(() => { ins.add({src: 'src', dest:''}) })
    })

    it('should throw on either empty array', ()=> {
      assert.throws(() => { ins.add({src: [], dest:'dest'}) })
      assert.throws(() => { ins.add({src: ['asd'], dest:[]}) })
    })
  })

})