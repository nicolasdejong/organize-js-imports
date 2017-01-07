'use strict';
const SPACING    = 'SPACING';
const REMARK     = 'REMARK';
const QUOTED     = 'QUOTED';
const OTHER      = 'OTHER';
const END        = 'END';

// The basic tokenizer only creates tokens for spacing, remarks, quotes and other.
// Side effect: eol will become '\n'.
module.exports = function BasicTokenizer(script) {
  let self = this;
  this.script = script.replace( /\r\n|\r/, '\n');
  this.len = this.script.length;
  this.pos = 0;

  function Token(type, text) {
    let self = this;
    this.type = type;
    this.text = text;

    this.is           = () => self.type == type;
    this.toString     = () => "[Token;type=" + self.type + ";text=" + self.text + "]";
    this.isSpacing    = () => self.type === SPACING;
    this.isRemark     = () => self.type === REMARK;
    this.isQuoted     = () => self.type === QUOTED;
    this.isOther      = () => self.type === OTHER;
    this.isEnd        = () => self.type === END;
    this.contains     = needle => self.text.indexOf(needle) >= 0;
    this.noContent    = () => self.isSpacing() || self.isRemark();
  }

  this.lineCount = 0;
  this.tokenize = () => {
    let tokens = [];
    while(parsing()) tokens.push( nextToken() );
    return tokens;
  };

  function nextToken() {
    let token;
    if(!parsing())     token = new Token(END,        ""); else
    if(isSpacing())    token = new Token(SPACING,    getSpacing()); else
    if(isRemark())     token = new Token(REMARK,     getRemark()); else
    if(isQuote())      token = new Token(QUOTED,     getQuote()); else
    /*any other text*/ token = new Token(OTHER,      getOther());
    return token;
  }
  function parsing()    { return self.pos < self.len; }
  function next()       { if(self.pos < self.len) self.pos++; }
  function getAndNext() { next(); return get(-1); }
  function get(offset)  {
    if(!offset) offset = 0;
    return self.pos + offset >= 0
        && self.pos + offset < self.len
         ? self.script.charAt(self.pos + offset)
         : 0;
  }

  function isSpacing()  {
    let c = get();
    if(c === '\n') self.lineCount++;
    return c === ' ' || c === '\t' || c === '\n' || c === '\r';
  }
  function getSpacing() {
    let text = '';
    while(isSpacing()) text += getAndNext();
    return text;
  }

  function isRemark() { return get() === '/' && (get(1) === '/' || get(1) === '*'); }
  function getRemark() {
    let text = '' + getAndNext() + getAndNext();
    if( get(-1) == '/' ) {
      while(!(get() == '\n') && parsing()) text += getAndNext();
    } else
    if( get(-1) == '*' ) {
      while(!(get() == '*' && get(1) == '/') && parsing()) {
        text += getAndNext();
      }
      text += '*/'; self.pos+=2;
    }
    return text.toString();
  }

  function isQuote()  { let c=get(); return c === "'" || c === '`' || c === '"'; }
  function getQuote() {
    let text = '';
    let quoteChar = get();
    text += getAndNext();
    while(!(get() == quoteChar && get(-1) != '\\') && parsing()) {
        if( quoteChar != '`' && get() == '\n' ) return text;
        text += getAndNext();
    }
    text += getAndNext(); // end quote
    return text;
  }

  function getOther() {
    let text = '';
    while( parsing() && !isSpacing() && !isRemark() && !isQuote() ) text += getAndNext();
    return text;
  }
};
