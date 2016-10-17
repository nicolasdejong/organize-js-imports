'use strict'
let fileIO     = require('fs');
let Organizer  = require('../src/OrganizeImports');
let TestHelper = require('./TestHelper');

describe('organize-js-imports', () => {

  it('should organize imports', () => {
    TestHelper.testOrganizeFile('test-file01');
  });

  it('imports without path should not affect justification', () => {
    TestHelper.testOrganizeFile('test-file04');
  });

  it('should work with streams', done => {
    let stream = fileIO.createReadStream('spec/test-files/test-file01.js');
    let changed = false;
    Organizer.organizeImportsOf(stream, (organized, fileContents) => {
      changed = true;
    }, () => {
      expect(changed).toBe(true, 'import using stream failed');
      done();
    });
  });
});
