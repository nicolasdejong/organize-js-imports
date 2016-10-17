# organize-js-imports

> Orders and justifies the imports in ES2015+ code

## Features

- Orders the imports by distance
- Orders the imports alphabetically by library and names
- Combines imports that refer to the same library
- Adds padding to keep froms below each other (can be disabled)

## Install

```
$ nmp install --save-dev organize-js-imports
```

## Usage

```
organize-js-imports <options>
Possible arguments:
-maxNamesLength (default:30) Name padding max. Set to 0 for no padding.
-path[s]        (default:**/*.js) One or more globs for files to process.
-encoding       (default:utf8) Encoding for reading and writing files.
-quiet          Don't print anything except errors.
-verbose        Print the name of each scanned file.
-debug          Print the name and altered imports of each scanned file.  
-dryRun         Files will not be altered.
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

MIT (c) Nicolas de Jong