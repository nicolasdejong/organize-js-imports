'use strict'
let Import = require('../src/Import');
let options = require('../src/Options').options;

describe('Import', () => {
  let test = (toTest, expected, toStringArg) => {
    it(toTest, () => {
      let imp = new Import(toTest);
      let result = imp.toString.call(imp, toStringArg);
      let msg = null;
      if( result !== expected ) {  // Jasmine has no diff support
        let pad = ('expected[' + expected.length + ']: ').length;
        for(let i=0; i<result.length && result.charAt(i) == expected.charAt(i); i++) pad++;
        msg = '\nEXPECTED:\n' +
              'expected:' + expected + '\n' +
              'result  :' + result + '\n' +
              Import.leftPad('^',pad+1);
      }
      expect(msg === null).toBe( true, msg );
    });
  };

  test('import {importfrom} from "./import-from-test"', "import {importfrom} from './import-from-test';");
  test('import a', 'import a;');
  test('import a', 'import a;', 5);
  test('import a from b', "import a from 'b';");
  test('import a from b', "import a     from 'b';", 5);
  test("import 'a' from b", "import 'a' from 'b';");
  test("import 'a' from b", "import 'a'   from 'b';", 5);
  test("import {c,b,d} from './foo';", "import {b, c, d} from './foo';");
  test("import {c,b,d} from './foo';", "import {b, c, d}       from './foo';", 15);
  test("import defaultVal, {a as A, b,c} from '../../foo';",
       "import defaultVal, {a as A, b, c} from '../../foo';");
});

describe('Imports', () => {
  it('sort order', () => {
    let imports = shuffle([
      new Import("import a"),
      new Import("import b"),
      new Import("import {c} from 'abc';"),
      new Import("import {z,a, m} from './foo'"),
      new Import("import {a,b,c} from './bar'"),
      new Import("import 'abc' from '../other/abcdef'"),
      new Import("import {c,b} from './foo'"),
      new Import("import {z,x,y} from './bar'"),
      new Import("import q from '../other/qrs'"),
      new Import("import 'd' from '../../src/config'"),
      new Import("import 'e' from '../../src/decorator/entity'"),
      new Import("import 'f' from '../../src/decorator/id'"),
    ]);
    let result = Import.importsToString(imports.slice());
    expect( '\n' + result.trim() + '\n' ).toEqual(`
import a;
import b;

import {c}                from 'abc';

import 'd'                from '../../src/config';
import 'e'                from '../../src/decorator/entity';
import 'f'                from '../../src/decorator/id';
import 'abc'              from '../other/abcdef';
import q                  from '../other/qrs';

import {a, b, c, x, y, z} from './bar';
import {a, b, c, m, z}    from './foo';
`
    );
    let mnl = options.maxNamesLength;
    options.maxNamesLength = 0;
    let resultNoPadding = Import.importsToString(imports.slice());
    options.maxNamesLength = mnl;
    expect( '\n' + resultNoPadding.trim() + '\n' ).toEqual(`
import a;
import b;

import {c} from 'abc';

import 'd' from '../../src/config';
import 'e' from '../../src/decorator/entity';
import 'f' from '../../src/decorator/id';
import 'abc' from '../other/abcdef';
import q from '../other/qrs';

import {a, b, c, x, y, z} from './bar';
import {a, b, c, m, z} from './foo';
`
    );
  });
  it('depthSort order', () => {
    let imports = shuffle([
      new Import("import a"),
      new Import("import b"),
      new Import("import {c} from 'abc';"),
      new Import("import {z,a, m} from './foo'"),
      new Import("import {a,b,c} from './bar'"),
      new Import("import 'abc' from '../other/abcdef'"),
      new Import("import {c,b} from './foo'"),
      new Import("import {z,x,y} from './bar'"),
      new Import("import q from '../other/qrs'"),
      new Import("import 'd' from '../../src/config'"),
      new Import("import 'e' from '../../src/decorator/entity'"),
      new Import("import 'f' from '../../src/decorator/id'"),
    ]);
    options.depthSort = true;
    let result = Import.importsToString(imports.slice());
    options.depthSort = false;
    expect( '\n' + result.trim() + '\n' ).toEqual(`
import a;
import b;

import {c}                from 'abc';

import 'e'                from '../../src/decorator/entity';
import 'f'                from '../../src/decorator/id';
import 'd'                from '../../src/config';
import 'abc'              from '../other/abcdef';
import q                  from '../other/qrs';

import {a, b, c, x, y, z} from './bar';
import {a, b, c, m, z}    from './foo';
`
    );
  });
});

describe('Import util', () => {
  it('leftPad', () => {
     expect( Import.leftPad('abc', 5) ).toEqual('  abc');
  });
  it('rightPad', () => {
     expect( Import.rightPad('abc', 5) ).toEqual('abc  ');
  });
});

function shuffle(a,b,c,d){c=a.length;while(c)b=Math.random()*(--c+1)|0,d=a[c],a[c]=a[b],a[b]=d; return a;}
