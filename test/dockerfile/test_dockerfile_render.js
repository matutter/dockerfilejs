var Dockerfile = require('../test.js').Dockerfile
var assert = require('chai').assert
var fs = require('fs')

var expected_0 = fs.readFileSync('./test/dockerfile/expected_0.Dockerfile', 'utf8')
var expected_1 = fs.readFileSync('./test/dockerfile/expected_1.MultiStage_Dockerfile', 'utf8')
var expected_2 = fs.readFileSync('./test/dockerfile/expected_2.MultiStage_Dockerfile', 'utf8')
var expected_3 = fs.readFileSync('./test/dockerfile/expected_3.Dockerfile', 'utf8')

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

  it('should support multi-stage AS syntax and ADD/COPY flags', () => {
    var result = new Dockerfile()
      .env({key: 'values', key2: 'values 2'})
      .from({image: 'alpine', tag: 'latest', registry: 'docker.io', name: 'baselayer'})
      .add({src: '/cert/id_rsa', dest:'~/.ssh/id_rsa', onbuild: true})
      .stage()
      .from({image: 'centos7', stage: 'nextstage'})
      .separator('\n')
      .env({key: 'values', key2: 'values 2'})
      .render()
    //fs.writeFileSync("result_2.MultiStage_Dockerfile", result);
    assert.equal(result, expected_2)
  });

  it('should support ADD/COPY syntax with chown & from flags', () => {
    var result = new Dockerfile()
      .separator('\n')
      .from({image: 'alpine', tag: 'latest', name: 'baselayer'})
      .add({src: '/tmp/0', dest:'/tmp/0', chown: 0})
      .add({src: '/tmp/b', dest:'/tmp/b', chown: 'root:root'})
      .add({src: '/tmp/c', dest:'/tmp/c', chown: { user: 'c', group: 'c' }})
      .add({src: '/tmp/d', dest:'/tmp/d', chown: { user: 'd', }})
      .add({src: '/tmp/e', dest:'/tmp/e', chown: { group: 'e' }})
      .add({src: '/tmp/f', dest:'/tmp/f', user: 'f', group: 'f' })
      .add({src: '/tmp/g', dest:'/tmp/g', user: 'g' })
      .add({src: '/tmp/1', dest:'/tmp/1', user: 1 })
      .add({src: '/tmp/0', dest:'/tmp/0', user: 0, group: 0 })
      .render();
    //fs.writeFileSync("result_3.Dockerfile", result);
    assert.equal(result, expected_3)
  });

});