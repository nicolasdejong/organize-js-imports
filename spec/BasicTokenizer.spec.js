'use strict'
let TestHelper = require('./TestHelper');

describe('BasicTokenizer', () => {

  it('tokenize should not affect file after imports', () => {
    TestHelper.testOrganizeFile('test-file02');
  });

  it('tokenize should accept unterminated imports', () => {
    TestHelper.testOrganizeFile('test-file03');
  });
});
