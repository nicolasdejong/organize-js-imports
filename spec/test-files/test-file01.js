// Test javascript to parse imports

import 'a';
import 'b'
import c from 'libc';
import d from 'libd'
import e as E from 'libe';
import f as F from 'libf'
import {g} from './libg';
import {h} from './libh'
import {g,h,i as I} from './libg';
import {h} from './libg';
import { i,i2 }
  from
'./libi';
import {j, j2}
from
'./libj'
import k
  as
  K
  from
  '../..//libk';
import l
as
L
from
'../..//libl'
import * from '../../../libm';
import * from '../../../libn'
import {aaaa,bbbb,cccc,dddd,eeee,ffff,gggg,hhhh} from '../libo';
//import p1 from './libp1';
/*import p2 from 'libp2';
import q from 'libq';
import r from 'libr';*/
import {s,t/*,u,v*/} from /*'../..*/'..//../libst';
import 'u'
import v, {w, x as X} from 'vwx';
import * from 'y';
import *, {z as Z} from 'starz';
import {importfrom} from './import-from-test';

// end
