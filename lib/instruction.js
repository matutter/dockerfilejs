const errors = require('./instruction-error.js')

function boxAndFilter(arrayOrString) {
  if(!Array.isArray(arrayOrString))
    arrayOrString = [arrayOrString]

  return arrayOrString
    .filter(string => string) // not null or undefined
    .filter(string => string != '') // not empty
}

function onBuild(instruction) {
  return `ONBUILD ${instruction}`
}

/**
* Case:
*   FROM <image>
*   FROM <image>:<tag>
*   FROM <image>@<digest>
*
* Parameters: 
*   image, (optional) tag, digest, registry
*
* Not standard:
*   If registry defined image is formatted as <registry>/<image>
*/
function from(from) {
  var instruction = null
  var image = from.image
  const tag = from.tag
  const digest = from.digest
  const registry = from.registry

  if(!image && typeof from === 'string') {
    image = from
  }

  if(image && (image = image.trim()) && image.length) {
    if(registry) {
      image = registry+'/'+image
    }
    if(tag) {
      instruction = `FROM ${image}:${tag}`
    } else if(digest) {
      instruction = `FROM ${image}@${digest}`
    } else {
      instruction = `FROM ${image}`
    }
  } else {
    throw new errors.MissingPropertyError('from', 'image', image)
  }

  return instruction
}

function maintainer(maintainer) {
  var instruction = null
  const name = maintainer.name || maintainer

  if(name && typeof name === 'string') {
    instruction = `MAINTAINER ${name}`
  } else {
    throw new errors.MissingPropertyError('maintainer', 'name', name)
  }

  return instruction
}

function enQuote(string) {
  return '"'+string+'"'
}

function mapToQuote(string) {
  if(/\s/g.test(string))
    string = enQuote(string)
  return string
}

/**
* Input string: returns trimmed string
* Input array of strings: returns a array of trimmed strings
*
* Note: Strings with WS in an array will be encapsulated by quotes 
*/
function mapCommandParams(command) {
  if(Array.isArray(command)) {
    command = command.map(mapToQuote).join(' ')
  }
  return command.trim()
}

/**
* Case:
*   RUN <command>
* Parameters: 
*   command (alias: commands)
*
* Expect string of well-formed command or an array of strings of
* well formed command and or arrays of command arguments.
* Example 1: well-formed command
*   run({command: 'touch /file.txt'})
* Example 2: array of well formed commands
*   run({command: ['touch /file.txt', ...]})
* Example 3: array of well formed commands and array of command argument
*   run({command: ['touch /file.txt', ['echo', 'hello world', '>>', '/file.txt']]})
*
* Note: Will trim leading and trailing WS
*/
function run(run) {
  var instruction = null
  var commands = run.command || run.commands || run

  if(commands == '') {
    throw new errors.EmptyStringError('cmd', 'command(s)')
  }

  if(commands) {
    if(typeof commands === 'string') {
      instruction = `RUN ${commands}`
    } else {
      commands = boxAndFilter(commands)

      if(commands.length) {
        instruction = `RUN ${commands.map(mapCommandParams).join(' \\\n  && ')}`
      } else {
        throw new errors.EmptyArrayError('cmd', 'command(s)')
      }
    }
  } else {
    throw new errors.MissingPropertyError('cmd', 'command(s)', commands)
  }

  return instruction
}

/**
* Case:
*   CMD ["executable","param1","param2"]
*   CMD ["param1","param2"]
*   CMD command param1 param2
*
* Parameters:
*   params and or (executable or command)
*   
*   Params may be empty if and only if executable or command is provided
*   
*   Solely providing the params property will yield the second case.
*   Providing the executable or command property will yield the first or third cases respectively.
*   Providing command and executable will throw an error
*/
function cmd(cmd) {
  var instruction = null
  var params = cmd.params
  const command = cmd.command
  const executable = cmd.executable

  if(command && executable) {
    throw new errors.PropertyConflictError('cmd', ['command', 'executable'])
  }

  if(params) {
    params = boxAndFilter(params)
  } else {
    params = null
  }

  if(executable) {
    if(params)
      instruction = `CMD ["${executable}", ${params.map(enQuote).join(', ')}]`
    else
      instruction = `CMD ["${executable}"]`
  } else if(command) {
    if(params)
      instruction = `CMD ${command} ${mapCommandParams(params)}`
    else
      instruction = `CMD ${command}`
  } else {
    if(params && params.length) {
      instruction = `CMD [${params.map(enQuote).join(', ')}]`
    } else {
      throw new errors.MissingPropertyError('cmd', 'params', params)
    }
  }


  return instruction
}

/**
* Case:
*   ENTRYPOINT ["executable", "param1", "param2"]
* 
* Docs:
*   https://docs.docker.com/engine/reference/builder/#/entrypoint
*
* As the documentation points out, the "exec" form is preferred.
*
*/
function entryPoint(entrypoint) {
  var instruction = null

  const executable = entrypoint.executable
  entrypoint = boxAndFilter(entrypoint.params)

  if(entrypoint.length) {
    instruction = `ENTRYPOINT ["${executable}", ${entrypoint.map(mapToQuote).join(', ')}]`
  } else {
    throw new errors.InstructionError('entrypoint', 'expected string or array of arguments.')
  }

  return instruction
}

/** 
* Flattens objects into an array of arrays, returns null if object has no OwnProperties.
*/
function flattenLabels(o, namespace) {
  namespace = namespace || []
  var r = []
  var ns = namespace.join('.')

  if(ns.length) ns = ns + '.'

  Object.keys(o).forEach( key => {
    const val = o[key]
    if(typeof val === 'string')
      return r.push([ns+key, val])

    r = r.concat(flattenLabels(val, namespace.concat([key])))
  })

  return r
}

/** Maps an array of ['key', 'val'] into a string of form 'key="val"' */
function mapLabel(label) {
  return label[0] + "=" + mapToQuote(label[1])
}

/**
* Case:
*   LABEL multi.label1="value1" multi.label2="value2" other="value3"
*   
*
*/
function label(labels, onbuild) {
  labels = flattenLabels(labels)
  var instruction = null

  if(labels && labels.length) {
    instruction = `LABEL ${labels.map(mapLabel).join(' \\\n      ')}`
  } else {
    throw new errors.InstructionError('label', 'Provided object with no OwnProperties.')
  }

  return onbuild ?  onBuild(instruction) : instruction
}

/**
* Case:
*   EXPOSE <port> [<port>...]
*   
* Expects an array of ports as numbers, strings, or an object of {number: <num or str>, protocol: <string> }
* If a port object is provided and the protocol field is blank it will be omitted.
*
* Example "port" object, assuming a EOLN standard object:
* var config = {
*   ports: [
*     {number: 443, protocol: 'tcp'},
*     8000
*   ]
* }
* instructions.expose(config.ports)
* 
* A "port object" may also specify from and to for a range of exposed ports, though
* simply supplying '8080-8086' will do the same.
*
* Examples 1, shows all possible input type variants:
*   port(['1', 2, {number: 3, protocol: 'tcp'}, {number: '4', protocol: 'udp'}])
*/
function expose(expose, onbuild) {
  var instruction = null
  const trim = (s) => s.toString().trim()
  expose = boxAndFilter(expose)
    .map(port => {
      if(port.from && port.to) {
        port.number = `${trim(port.from)}-${trim(port.to)}`
      }
      if(port.number) {
        if(port.protocol) {
          return `${trim(port.number)}/${trim(port.protocol)}`
        } else {
          return trim(port.number)
        }
      } else if(typeof port === 'string' || typeof port === 'number') {
        return trim(port)
      } else {
        throw new TypeError('Expected object of type String, Number, or Port. Found:'+port)
      }
    })

  if(expose.length) {
    instruction = `EXPOSE ${expose.join(' ')}`
  } else {
    throw new errors.InstructionError(
      'expose',
      'expected one of string, number, Port object, [string or number or Port object, ...]'
    )
  }

  return onbuild ?  onBuild(instruction) : instruction
}

/**
* ENV <key> <value>
* ENV <key>=<value> ...
* 
* Parameters:
*   1) Any object with terminal property-values of string, or number type.
*/
function env(env, onbuild) {
  var instruction = null

  env = flattenLabels(env)

  if(env.length) {
    instruction = `ENV ${env.map(e => `${e[0]}=${mapToQuote(e[1])}`).join(' \\\n    ')}`
  } else {
    throw new errors.InstructionError('env', 'expected string or array of arguments.')
  }

  return onbuild ?  onBuild(instruction) : instruction
}

// used to generate add and copy since they are of the same form
function copyInternal(command, src, dest, onbuild) {
  var instruction = null
  src = boxAndFilter(src)

  if(src.length == 0) {
    throw new errors.EmptyArrayError(command, 'src')
  } 

  if(dest && dest.length) {
    instruction = `${command} [${src.map(enQuote).join(', ')}, "${dest}"]`
  } else {
    throw new errors.MissingPropertyError(command, 'dest')
  }

  return onbuild ?  onBuild(instruction) : instruction
}

/**
* Case (* preferred):
*   ADD <src>... <dest>
*   * ADD ["<src>",... "<dest>"]
*/
function add(add, onbuild) {
  var instruction = null
  const src = add.src
  const dest = add.dest
  instruction = copyInternal('ADD', src, dest, onbuild)
  return instruction
}

/**
* Case (* preferred):
*   COPY <src>... <dest>
*   * COPY ["<src>",... "<dest>"]
*/
function copy(copy, onbuild) {
  var instruction = null
  const src = copy.src
  const dest = copy.dest
  instruction = copyInternal('COPY', src, dest, onbuild)
  return instruction
}

function user(user, onbuild) {
  user = 'USER ' + user
  return onbuild ? onBuild(user) : user
}

function workdir(workdir, onbuild) {
  workdir = 'WORKDIR ' + workdir
  return onbuild ? onBuild(workdir) : workdir
}

function stopSignal(stopSignal, onbuild) {
  stopSignal = 'STOPSIGNAL ' + stopSignal
  return onbuild ? onBuild(stopSignal) : stopSignal
}

function volume(volume, onbuild) {
  volume = `VOLUME  [${volume.map(enQuote).join(', ')}]`
  return onbuild ? onBuild(volume) : volume
}

const valid_healthcheck_options = ['interval', 'timeout', 'retries']
/**
* Case:
*   HEALTHCHECK [OPTIONS] CMD command
*   HEALTHCHECK NONE
*
* Case 1: Pass an object with the properties for the CMD instruction, (optional) options
* Case 2: healthCheck(false)
*
* Docs: https://docs.docker.com/engine/reference/builder/#/healthcheck
*/
function healthCheck(healthCheck) {
  var instruction = null

  if(healthCheck == false) {
    instruction = 'HEALTHCHECK NONE'
  } else {
    var options = healthCheck.options

    if(options) {
      var keys = Object.keys(options)
        .filter(option => ~valid_healthcheck_options.indexOf(option))

      if(keys.length) {
        options = keys.map(k => {
          return `--${k}=${options[k]}`
        }).reduce((a,b) => a+' '+b)        
      }
    }

    var command = cmd(healthCheck)

    if(options.length)
      instruction = `HEALTHCHECK ${options} \\\n  ${command}`
    else
      instruction = `HEALTHCHECK ${command}`
  }

  return instruction
}

/**
* Case:
*   SHELL ["executable", "parameters"]
*/
function shell(shell) {
  return `SHELL [${shell.map(enQuote).join(', ')}]`
}

function comment() {
  if(arguments.length == 0)
    return '#'
  var args = []
  for(var i = 0; i < arguments.length; ++i)
    args.push(arguments[i])
  return '# ' + args.map(arg => arg ? arg.toString() : arg).join(' ') 
}

module.exports.from = from
module.exports.maintainer = maintainer
module.exports.run = run
module.exports.cmd = cmd
module.exports.entryPoint = entryPoint
module.exports.label = label
module.exports.expose = expose
module.exports.env = env
module.exports.add = add
module.exports.copy = copy
module.exports.user = user
module.exports.workdir = workdir
module.exports.stopSignal = stopSignal
module.exports.volume = volume
module.exports.healthCheck = healthCheck
module.exports.shell = shell
module.exports.comment = comment