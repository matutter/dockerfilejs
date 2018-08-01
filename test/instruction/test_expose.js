var ins = require('../test.js').instruction
var assert = require('chai').assert

describe('testing instruction expose', () => {
  it('should produce EXPOSE 8080', ()=> {
    const result = ins.expose(8080)
    assert.equal(result, 'EXPOSE 8080')
  });

  it('should produce EXPOSE 8080/tcp', ()=> {
    const result = ins.expose({ number: 8080, protocol: 'tcp' })
    assert.equal(result, 'EXPOSE 8080/tcp')
  });

  it('should produce EXPOSE 8000-9000', ()=> {
    const result = ins.expose({ from: 8000, to: '9000' })
    assert.equal(result, 'EXPOSE 8000-9000')
  });

  it('should produce EXPOSE 8000-9000/udp', ()=> {
    const result = ins.expose({ from: 8000, to: '9000', protocol: 'udp' })
    assert.equal(result, 'EXPOSE 8000-9000/udp')
  });
});
