const DockerfileModel = {
  from : {
    image : null,
    tag : null,
    digest : null,
    registry : null,
    stage : null
  },
  maintainer : {
    name : null
  },
  run : {
    command : [null]
  },
  cmd : {
    command : null,
    executable : null,
    params : [null]
  },
  entryPoint : {
    executable: null,
    params: null
  },
  label: {},
  expose : [
    '',
    0,
    {
      number: 0,
      protocol: ''
    }
  ],
  env : {},
  add : {
    src: [],
    dest: '',
    chown: ''
  },
  copy: {
    src: [],
    dest: '',
    chown: '',
    from: ''
  },
  user: '',
  workdir: '',
  stopSignal: '',
  volume : [''],
  healthCheck : {
    options: {
      interval : '',
      timeout: '',
      retries: 0
    },
    command : null,
    executable : null,
    params : [null]
  },
  shell : [],
  comment: ''
}

module.exports.Dockerfile = DockerfileModel