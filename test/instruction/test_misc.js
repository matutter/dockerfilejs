var ins = require('../test.js').instruction
var assert = require('chai').assert

const command = {
  "ADD" : ins.add,
  "COPY" : ins.copy,
  "ENV" : ins.env,
  "EXPOSE" : ins.expose,
  "LABEL" : ins.label,
  "USER" : ins.user,
  "WORKDIR" : ins.workdir,
  "VOLUME" : ins.volume, 
  "STOPSIGNAL" : ins.stopSignal 
}

var instr_exports = [
  "from",       "maintainer", "run",          "cmd",
  "entryPoint", "label",      "expose",       "env",
  "add",        "copy",       "user",         "workdir",
  "stopSignal", "volume",     "healthCheck",  "shell",
  "comment"
]

var onBuild_methods = [
  "ADD",  "COPY",  "ENV",  "EXPOSE", 
  "LABEL",  "USER",  "WORKDIR",  "VOLUME", 
  "STOPSIGNAL"
]

var valid_inputs = {
  ADD : {src: '/file.txt', dest: '/file.txt'},
  COPY : {src: '/file.txt', dest: '/file.txt'},
  ENV : {key: 'val', key2: 'val 2'},
  EXPOSE : [8000, '8001', {number: 433, protocol: 'tcp'}, {from: 8080, to:8086}],
  LABEL : { key: 'val', nested: {key: 'val', doubley: { key: 'val'}}},
  USER : 'user1',
  WORKDIR : '/git/',
  VOLUME : ['/var/log'],
  STOPSIGNAL : 9,
}

describe('"instructions" are exported from the main module', ()=> {
  it('should export each instruction from https://docs.docker.com/engine/reference/builder/', ()=> {
    var ins_exports_found = Object.keys(ins)
    assert.deepEqual(instr_exports, ins_exports_found)
  })
})

describe('All onBuild instruction are passed true as a second parameter', ()=> {
  it('should prefix each with ONBUILD', ()=> {
    onBuild_methods.forEach(method_name => {
      var command_name = method_name.toUpperCase()
      var input = valid_inputs[command_name]
      var res = command[command_name](input, true)
      assert(res.startsWith('ONBUILD'))
    })
  })
})

/*

var res = null 

res = ins.from({image: "alpine"})
res = ins.run({command: ['touch /file.txt', ['echo', 'hello world', '>>', '/file.txt']]})
res = ins.run({command: ['echo', 'hello world', '>>', '/file.txt']})
res = ins.from({image: "alpine", registry: 'my_registry.io'})
//res = ins.cmd({executable: '/bin/bash', command: 'echo'})
res = ins.cmd({executable: '/bin/bash', params: ['-c', 'echo', 'hello world', '>>', '/file.txt']})
res = ins.cmd({executable: '/bin/bash'})
res = ins.cmd({command: 'touch /file.txt'})
res = ins.cmd({params: ['hello world', '>>', '/file.txt']})
//res = ins.cmd({params: null})
res = ins.label({ key: 'val', nested: {key: 'val', doubley: { key: 'val'}}}, true)
//res = ins.label({ })
res = ins.entryPoint(['/bin/bash', '-c'])
//res = ins.entryPoint(null)
//res = ins.entryPoint('')
//res = ins.entryPoint([])
res = ins.expose([8000, '8001', {number: 433, protocol: 'tcp'}, {from: 8080, to:8086}])
//res = ins.expose([{from: 8080}])
res = ins.expose([{number: 433}], true)
res = ins.env({key: 'val', key2: 'val 2'})

res = ins.volume(['/var/log', '/root/.ssh'])
res = ins.healthCheck({
  options : {
    interval: '5m',
    timeout: '3s',
    retries: 5
  },
  command : 'curl',
  params: ['-f', 'http://localhost/', '||', 'exit', 1]
})
res = ins.healthCheck(false)
res = ins.comment('I am a', 100, 'year old' , 'Wizard')
res = ins.shell(['cmd', '/S', '/C'])



console.log(res)
*/