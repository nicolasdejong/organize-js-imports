// Test javascript to parse imports

import 'a'
import 'b'

  import c from 'libc'
import d from 'libd'

import 'e'
function abc() {
  let abc = 123;
  let regex = /some|import|regex/g;
}

import 'f'
const def = 456;


import j, { k, l, m } from 'foo'
function ghi() {
  let ghi = 456;
}

import {o} from './../opq'
import {p} from '../opq'
import {q} from '../opq'
import r from '../rst'