'use strict'
let TestHelper = require('./TestHelper');

describe('Options', () => {
  let Options = require('../src/Options');
  it('from cli arguments', () => {
    Options.processArgs(['-maxNamesLength', '10', '-dryRun', '-path', 'b', 'c', 'd', '-recent', '1', 'day']);
    let expected = Object.assign( {}, Options.defaults, {
      path: ['b', 'c', 'd'],
      maxNamesLength: 10,
      dryRun: true,
      recent: ['1', 'day']
    } );
    expect(TestHelper.objToString(Options.options)).toBe(TestHelper.objToString(expected));
  });
});