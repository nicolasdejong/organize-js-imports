'use strict'
let options = require('./Options').options;

module.exports = Import;

/* from MDN:
  import defaultMember from "module-name";
  import * as name from "module-name";
  import { member } from "module-name";
  import { member as alias } from "module-name";
  import { member1 , member2 } from "module-name";
  import { member1 , member2 as alias2 , [...] } from "module-name";
  import defaultMember, { member [ , [...] ] } from "module-name";
  import defaultMember, * as name from "module-name";
  import "module-name";
*/
function Import(s0) {
  let self = this;
  let s = (s0||'').replace( /\s+/g, ' ' ).replace( /;+$/, '' );
  let parts = s.split( /\s*(?:import|from|;)\s*/ );

  let nameParts = /^\s*(.*?)(?:,\s*(\{[^}]+\}))?\s*$/.exec( parts[1] );
  this.nameDefault = nameParts[2] ? nameParts[1] : null;
  this.names = nameParts[ nameParts[2] ? 2 : 1];
  this.isBraced = this.names.substring(0,1) === '{';
  this.names = this.names.trim().replace( /^\{|\}$/g, '').split( /,/ ).map( n => n.trim() ).sort();
  this.path = parts.length > 2 ? cleanPath(parts[2]) : '';


  function cleanPath(p) {
    return p.trim()
            .replace( /^\s*['"`]/, '')
            .replace( /['"`]\s*$/, '')
            .replace( /^\.\/\.\.\//, '../') // "./../" -> "../"
            ;
  }

  this.add = function(otherImport) {
    if (self.path != otherImport.path) return; // only names of equal paths should be combined
    let known = {};
    self.names.forEach(n => known[n]=true);
    otherImport.names.forEach(n => { if (!known[n]) self.names.push(n); } );
    if (self.names.length) self.isBraced = true;
  };

  this.namesJoined = function() {
    return   (self.nameDefault ? self.nameDefault + (self.names.length ? ', ' : '') : '')
           + (self.isBraced ? '{' : '')
           +  self.names.join(options.namesJoin)
           + (self.isBraced ? '}' : '');
  };

  this.toString = function(namesLen0) {
    let joinedNames = this.namesJoined();
    let namesLen = Math.min( namesLen0, options.maxNamesLength );
    return "import " +
           (self.path === ''
             ? joinedNames
             : (joinedNames.length > options.maxNamesLength
                 ? joinedNames + '\n' + leftPad("", namesLen + "import ".length)
                 : rightPad(joinedNames, namesLen)
               ) +
               " from " + options.pathQuote + self.path + options.pathQuote
           ) +
           ';';
  }

  // Imports will be sorted furthest to closest distance.
  self.distance = () => {
    if (!this.path) return 3;                            // 3: import 'a';
    if (this.path.substring(0, 2) === './') return 0;    // 0: import a from './amodule';
    if (this.path.substring(0, 3) === '../') return 1;   // 1: import a from '../amodule';
    return 2;                                            // 2: import a from 'amodule';
  };
};

Import.importsToString = function importsToString(imports) {
  function combinePaths() {
    let pathToImport = {};
    for(let i=0; i<imports.length; i++) {
      let imp = imports[i];
      if(imp.path) {
        let existingImport = pathToImport[imp.path];
        if (!existingImport) pathToImport[imp.path] = imp;
        else {
          pathToImport[imp.path].add(imp);
          imports.splice(i--,1);
        }
      }
    }
  }
  function sort() {
    let isQuote = c => c == '"' || c == "'" || c == '`';
    let skipQuote = s => isQuote(s.charAt(0)) ? s.substring(1) : s;
    imports.forEach( imp => imp.names.sort( (a,b) => {
      a = skipQuote(a);
      b = skipQuote(b);
      if ( '\'"`'.indexOf(b.charAt(0)) >= 0 ) b = b.substring(1);
      return a === b ? 0 : a < b ? -1 : 1;
    }) );
    imports.sort( (a, b) => {
      if (a.distance() === b.distance()) {
        return a.path === b.path
                 ? (a.names[0] < b.names[0] ? -1 : 1)
                 : (a.path < b.path ? -1 : 1);
      }
      return b.distance() - a.distance();
    });
  }
  function join() {
    let namesLen = imports.map( imp => imp.path ? imp.namesJoined().length : 0 )
                          .reduce( (max,curr) => curr > options.maxNamesLength ? max : Math.max(max, curr), 0 );
    let result = '';
    let distance = -1;
    imports.forEach(imp => {
      let impDist = imp.distance();
      if(impDist != distance) {
        if(distance > 0) result += '\n';
        distance = impDist;
      }
      result += imp.toString(namesLen) + '\n';
    });
    result += '\n';
    return result.toString();
  }
  combinePaths();
  sort();
  return join();
};

function leftPad(str, len, ch) { return pad(str, len, ch, -1); }
function rightPad(str, len, ch) { return pad(str, len, ch, 1); }
function pad(str, len, ch, side) {
  str = String(str);
  let i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  side = (!side || side < 0) ? -1 : 1;
  while (++i < len) str = side < 0 ? ch + str : str + ch;
  return str;
}

// for testing only
Import.leftPad = leftPad;
Import.rightPad = rightPad;
