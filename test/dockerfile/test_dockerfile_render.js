var Dockerfile = require('../test.js').Dockerfile
var assert = require('chai').assert
var fs = require('fs')

var expected_0 = fs.readFileSync('./test/dockerfile/expected_0.Dockerfile', 'utf8')
var expected_1 = fs.readFileSync('./test/dockerfile/expected_1.MultiStage_Dockerfile', 'utf8')


describe('testing Dockerfile render', ()=> {

  it('should render valid dockerfiles', () => {
    var result = new Dockerfile()
      .comment('this is a comment')
      .env({key: 'values', key2: 'values 2'})
      .separator('\n')
      .from('centos7')
      .add({src: '/cert/id_rsa', dest:'~/.ssh/id_rsa'}, true)
      .render()

    assert.equal(result, expected_0)
  });

  it('should support multi-stage dockerfiles', () => {
    var result = new Dockerfile()
      .comment('this is a comment')
      .env({key: 'values', key2: 'values 2'})
      .separator('\n')
      .from('centos7')
      .add({src: '/cert/id_rsa', dest:'~/.ssh/id_rsa'}, true)
      .stage()
      .from('centos7')
      .env({key: 'values', key2: 'values 2'})
      .add({src: '/cert/id_rsa', dest:'~/.ssh/id_rsa'}, true)
      .render()
    //fs.writeFileSync("result_1.MultiStage_Dockerfile", result);
    assert.equal(result, expected_1)
  });

})