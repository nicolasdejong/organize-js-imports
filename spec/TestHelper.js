'use strict'
let Import    = require('../src/Import');
let Organizer = require('../src/OrganizeImports');
let fileIO    = require('fs');
let options   = require('../src/Options').options;

module.exports = {
  getMessageIfNotEqual: function(expected, result) {
    let msg = null;
    if(result !== expected) { // Jasmine has no diff support
      let pos = 0;
      while (pos<result.length && pos<expected.length && result.charAt(pos) === expected.charAt(pos)) pos++;
      let lpos = pos;
      while (lpos>0 && result.charAt(lpos) !== '\n') lpos--;
      let endpos = pos;
      while (endpos<result.length && result.charAt(endpos) !== '\n') endpos++; endpos-=2;
      msg = '\nEXPECTED:\n' +
            expected.substring(lpos+1, endpos) +
            '\nRESULT:\n' +
            result.substring(lpos+1, endpos) + '\n' +
            Import.leftPad('^', pos - lpos) + '\n' +
            'FULL RESULT:\n' +
            result;
    }
    return msg;
  },

  objToString: obj => {
    return Object.keys(obj).sort().reduce( (a,key) => a += key + '=' + obj[key] + ',', '' );
  },

  testOrganizeFile(name, noChange) {
    let path     = `spec/test-files/${name}.js`;
    let text     = fileIO.readFileSync(path, { encoding:options.encoding });
    let expected = fileIO.readFileSync(path + (noChange?'':'.expected'), { encoding:options.encoding });
    let result   = Organizer.organizeImportsOf(text);

    let msg = module.exports.getMessageIfNotEqual(expected, result);
    expect(msg === null).toBe(true, msg);
  }
};
