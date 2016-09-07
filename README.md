[![Build Status](https://travis-ci.org/matutter/dockerfilejs.svg?branch=master)](https://travis-ci.org/matutter/dockerfilejs) [![Coverage Status](https://coveralls.io/repos/github/matutter/dockerfilejs/badge.svg?branch=master)](https://coveralls.io/github/matutter/dockerfilejs?branch=master)

# Dockerfilejs
#### A simple Dockerfile generator. [Try it now!](https://tonicdev.com/npm/dockerfilejs)
```javascript
var Dockerfile = require("dockerfilejs").Dockerfile

var file = new Dockerfile()

file.comment('The above code example yields this file!')
.env({DEBUG:'express:* node index.js'})
.expose(8080)
.separator('\n')
.from({ image : 'node', tag : '4-onbuild'})
.comment('FROM gets bumped under initial comments')
.render()
```

```Dockerfile
# The above code example yields this file!
FROM node:4-onbuild
ENV DEBUG="express:* node index.js"
EXPOSE [ 8080 ]
# FROM gets bumped under initial comments
```
