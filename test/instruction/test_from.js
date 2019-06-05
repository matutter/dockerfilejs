var ins = require('../test.js').instruction
var assert = require('chai').assert

var registry = 'registry'
var digest = 'digest'
var image = 'image'
var tag = 'tag'
var stage = 'stage'

function opts(registry, image, digest, tag, stage) {
  var o = {}
  if(registry) o.registry = registry
  if(image) o.image = image
  if(digest) o.digest = digest
  if(tag) o.tag = tag
  if(stage) o.stage = stage
  return o
}

describe('testing instruction "FROM"', () => {

  describe('with a "registry" propery', () => {
    const inputs = [
      opts(registry, image),
      opts(registry, image, digest),
      opts(registry, image, false, tag),
    ]
    const expected = [
      'FROM registry/image',
      'FROM registry/image@digest',
      'FROM registry/image:tag',
    ]
    for(var i = 0; i < inputs.length; ++i) {
      var result = ins.from(inputs[i])
      var expected_result = expected[i]
      it('shoud make '+expected_result, ()=> {
        assert.equal(result, expected_result)
      })
    }
  })

  describe('stages', () => {
    const inputs = [
      opts(false, image, false, false, stage),
      opts(false, image, digest, false, stage),
      opts(false, image, false, tag, stage),
    ]

    const expected = [
      'FROM image AS stage',
      'FROM image@digest AS stage',
      'FROM image:tag AS stage'
    ]

    for (var i = 0; i < inputs.length; ++i) {
      var result = ins.from(inputs[i])
      var expected_result = expected[i]
      it('should make '+expected_result, ()=> {
        assert.equal(result, expected_result)
      })
    }
  })

  describe('with a string as input', () => {
    const expected = 'FROM just_prepends_from'
    it('should just prepend "FROM "', ()=> {
      var result = ins.from("just_prepends_from")
      assert.deepEqual(result, expected)
    })
  })

  describe('with invalid input', () => {
    it('should throw on undefined or null', ()=> {
      assert.throws(() => { ins.from() })
      assert.throws(() => { ins.from(null) })
    })
    it('should throw on empty string', ()=> {
      assert.throws(() => { ins.from('') })
    })
    it('should throw on object with falsy or no "image" property', ()=> {
      assert.throws(() => { ins.from({}) })
      assert.throws(() => { ins.from({image: null}) })
      assert.throws(() => { ins.from({image: undefined}) })
    })
    it('should throw on object with empty string for "image" property', ()=> {
      assert.throws(() => { ins.from({image: ''}) })
      assert.throws(() => { ins.from({image: '    '}) })
    })
  })

  /*describe('', () => {
    const expected = ''
    it('', ()=> {
      assert.deepEqual(result, expected)
    })
  })  */

})