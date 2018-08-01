[![Build Status](https://travis-ci.org/matutter/dockerfilejs.svg?branch=master)](https://travis-ci.org/matutter/dockerfilejs) [![Coverage Status](https://coveralls.io/repos/github/matutter/dockerfilejs/badge.svg?branch=master)](https://coveralls.io/github/matutter/dockerfilejs?branch=master)

# Dockerfilejs
#### A simple Dockerfile generator. [Try it now!](https://tonicdev.com/npm/dockerfilejs)
```javascript
var Dockerfile = require("dockerfilejs").Dockerfile;
var file = new Dockerfile();

file.comment('The above code example yields this file!')
  .env({DEBUG:'express:* node index.js'})
  .expose(8080)
  .separator('\n')
  .from({ image : 'node', tag : 'latest'})
  .comment('FROM gets bumped under initial comments')
  .render();
```

```Dockerfile
# The above code example yields this file!
FROM node:latest
ENV DEBUG="express:* node index.js"
EXPOSE 8080
# FROM gets bumped under initial comments
```

#### Complex environment? No problem!
```javascript
file.env({
    complex: {
        objects:  'are not',
        a: 'problem',
        at : {
            all: 'really!'
        }
}}).render();
/*
ENV complex.objects="are not" \
    complex.a=problem \
    complex.at.all=really!
*/
```

#### Made a mistake? Get rid of it!
```javascript
file.copy('~/.ssh/*', '/tmp');
// oops!
file.steps().pop();
```

#### Advanced examples
```javascript
file.separator('\n')
// Will set the separator of each step for the entire file.render() output

file.label({ complex: { objects: 'allowed' } });
// LABEL complex.objects="allowed"

file.expose([8080, '8081', { number: 443, protocol: 'tcp' }]);
// EXPOSE 8080 8081 443/tcp

file.run({ command: ['touch /file.txt', ['echo', 'hello world', '>>', '/file.txt'] ] });
// RUN touch /file.txt \
//   && echo "hello world" >> /file.txt

file.copy({ src : ['/id_rsa', '/id_rsa.pub'], dest: '/root/.ssh/' }, true);
// ONBUILD COPY ["/id_rsa", "/id_rsa.pub", "/root/.ssh"]

file.cmd({ executable: '/bin/bash', params: ['-c', 'hello world'] });
// CMD ["/bin/bash", "-c", "hello world"]

file.cmd({ command:'/bin/bash', params: ['-c', 'hello world'] })
// CMD /bin/bash -c "hello world"

file.healthCheck({
    options: { retries: 4, timeout: '30s'},
    command: 'wget',
    params: ['example.com']
})
// HEALTHCHECK --retries=4 --timeout=30s \
//   CMD wget example.com

file.user('root');
// USER root

file.from({ image: 'node', registry: 'docker.io', tag: '10-alpine' })
// FROM docker.io/node:10-alpine
```
