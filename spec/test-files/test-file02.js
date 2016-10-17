// Test javascript to parse imports

import 'a';
import 'b'

import c from 'libc';
import d from 'libd'

// the following should not be affected

function foobar() {
  let abc = 123;
  let regex = /some|import|regex/g;
}

function shuffle(a,b,c,d){c=a.length;while(c)b=Math.random()*(--c+1)|0,d=a[c],a[c]=a[b],a[b]=d; return a;}

function parseOptions(argv) {
  var files = [],
      color = process.stdout.isTTY || false,
      filter,
      stopOnFailure,
      random,
      seed;

  argv.forEach(function(arg) {
    if (arg === '--no-color') {
      color = false;
    } else if (arg.match("^--filter=")) {
      filter = arg.match("^--filter=(.*)")[1];
    } else if (arg.match("^--stop-on-failure=")) {
      stopOnFailure = arg.match("^--stop-on-failure=(.*)")[1] === 'true';
    } else if (arg.match("^--random=")) {
      random = arg.match("^--random=(.*)")[1] === 'true';
    } else if (arg.match("^--seed=")) {
      seed = arg.match("^--seed=(.*)")[1];
    } else if (isFileArg(arg)) {
      files.push(arg);
    }
  });
  return {
    color: color,
    filter: filter,
    stopOnFailure: stopOnFailure,
    files: files,
    random: random,
    seed: seed
  };
}

;(function(n,t){function r(n){return n&&typeof n=="object"&&n.__wrapped__?n:this instanceof r?(this.__wrapped__=n,void 0):new r(n)}function e(n,t,r){t||(t=0);var e=n.length,u=e-t>=(r||at);if(u){var o={};for(r=t-1;++r<e;){var i=n[r]+"";(St.call(o,i)?o[i]:o[i]=[]).push(n[r])}}return function(r){if(u){var e=r+"";return St.call(o,e)&&-1<z(o[e],r)}return-1<z(n,r,t)}}function u(n){return n.charCodeAt(0)}function o(n,t){var r=n.b,e=t.b;if(n=n.a,t=t.a,n!==t){if(n>t||typeof n=="undefined")return 1;if(n<t||typeof t=="undefined")return-1
}return r<e?-1:1}function i(n,t,r,e){function u(){var a=arguments,c=i?this:t;return o||(n=t[f]),r.length&&(a=a.length?(a=v(a),e?a.concat(r):r.concat(a)):r),this instanceof u?(s.prototype=n.prototype,c=new s,s.prototype=W,a=n.apply(c,a),x(a)?a:c):n.apply(c,a)}var o=w(n),i=!r,f=t;return i&&(r=t),o||(t=n),u}function f(n,t,r){if(n==W)return G;var e=typeof n;if("function"!=e){if("object"!=e)return function(t){return t[n]};var u=vr(n);return function(t){for(var r=u.length,e=X;r--&&(e=j(t[u[r]],n[u[r]],ft)););return e
}}return typeof t!="undefined"?1===r?function(r){return n.call(t,r)}:2===r?function(r,e){return n.call(t,r,e)}:4===r?function(r,e,u,o){return n.call(t,r,e,u,o)}:function(r,e,u){return n.call(t,r,e,u)}:n}function a(){for(var n,t={e:tt,f:rt,g:Jt,i:Wt,j:Zt,k:jt,b:"l(n)",c:"",h:"",l:"",m:Q},r=0;n=arguments[r];r++)for(var e in n)t[e]=n[e];if(n=t.a,t.d=/^[^,]+/.exec(n)[0],r="var j,n="+t.d+",u=n;if(!n)return u;"+t.l+";",t.b?(r+="var o=n.length;j=-1;if("+t.b+"){",t.j&&(r+="if(m(n)){n=n.split('')}"),r+="while(++j<o){"+t.h+"}}else{"):t.i&&(r+="var o=n.length;j=-1;if(o&&k(n)){while(++j<o){j+='';"+t.h+"}}else{"),t.f&&(r+="var v=typeof n=='function';"),t.g&&t.m?(r+="var s=-1,t=r[typeof n]?p(n):[],o=t.length;while(++s<o){j=t[s];",t.f&&(r+="if(!(v&&j=='prototype')){"),r+=t.h+"",t.f&&(r+="}")):(r+="for(j in n){",(t.f||t.m)&&(r+="if(",t.f&&(r+="!(v&&j=='prototype')"),t.f&&t.m&&(r+="&&"),t.m&&(r+="i.call(n,j)"),r+="){"),r+=t.h+";",(t.f||t.m)&&(r+="}")),r+="}",t.e)for(r+="var g=n.constructor;",e=0;7>e;e++)r+="j='"+t.k[e]+"';if(","constructor"==t.k[e]&&(r+="!(g&&g.prototype===n)&&"),r+="i.call(n,j)){"+t.h+"}";
return(t.b||t.i)&&(r+="}"),r+=t.c+";return u",Function("f,i,k,l,m,r,p","return function("+n+"){"+r+"}")(f,St,y,sr,A,ur,Ft)}function c(n){return"\\"+or[n]}function l(n){return gr[n]}function p(n){return typeof n.toString!="function"&&typeof(n+"")=="string"}function s(){}function v(n,t,r){t||(t=0),typeof r=="undefined"&&(r=n?n.length:0);var e=-1;r=r-t||0;for(var u=Array(0>r?0:r);++e<r;)u[e]=n[t+e];return u}function g(n){return yr[n]}function y(n){return kt.call(n)==Bt}function h(n){var t=X;if(!n||typeof n!="object"||y(n))return t;
