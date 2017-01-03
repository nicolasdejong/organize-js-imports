# organize-js-imports

> Orders and justifies the imports in ES2015+ code

## Features

- Orders the imports by distance
- Orders the imports alphabetically by library and names
- Combines imports that refer to the same library
- Adds padding to keep froms below each other (can be disabled)

## [Changelog](https://github.com/nicolasdejong/organize-js-imports/blob/master/CHANGELOG.txt)

## Install

```
$ npm install organize-js-imports
$ node ./node_modules/organize-js-imports -dry-run
```

## Usage

```
organize-js-imports <options>
Possible arguments (dashed possible: -max-names-length, -dry-run):
-maxNamesLength (default:30) Name padding max. Set to 0 for no padding.
-path[s]        (default:**/*.js) One or more globs for files to process.
-gitModified    Overrides -path to process the modified files according to git.
-exclude[s]     (default:**/node_modules/** **/jspm_package/**)
                One or more globs for files to exclude.
-encoding       (default:utf8) Encoding for reading and writing files.
-recent [n] [p] Only process files altered in the recent n (def=1) period.
                Period is one of milliseconds/ms, seconds/s, hours/h,
                minutes/m, days/d(def), weeks/w, months/M, quarters/Q, years/y.
-older n [p]    Only process files altered at least n p ago.
                The n and p like -recent.
-depthSort      Imports will be sorted on their depth (deepest first).
-quiet          Don't print anything except errors.
-verbose        Print the name of each scanned file.
-debug          Print the name and altered imports of each scanned file.  
-dryRun         Files will not be altered.
-validate       Exits 10 when files need organizing. Files will not be altered.
```

For example
```
$ organize-js-imports -paths src/foo/**/*.js src/bar/bar.js -maxNamesLength 40 -verbose
```


## Example

### Input
```javascript
import 'b'
import {c} from 'libc'
import {o} from './../opq'
import d from './libd'
import j, { k,l,m } from 'foo'
import {p} from '../opq';
import 'a'
import 'w'
import {q} from '../opq';
import r from '../rst'
import {x,y} from './xy'
```

### Organized
```javascript
import 'a';
import 'b';
import 'w';

import j, {k, l, m} from 'foo';
import {c}          from 'libc';

import {o, p, q}    from '../opq';
import r            from '../rst';

import d            from './libd';
import {x, y}       from './xy';
```

## License

MIT (C) Nicolas de Jong
