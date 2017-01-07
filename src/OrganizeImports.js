'use strict'
let fileIO         = require('fs');
let stream         = require('stream');

let Options        = require('./Options');
let options        = Options.options;
let Import         = require('./Import');
let BasicTokenizer = require('./BasicTokenizer');

module.exports.organizeImportsOfFile = organizeImportsOfFile;
module.exports.organizeImportsOfText = organizeImportsOfText;

// whenChanged(organized, fileContents), whenFinished()
// handles: filename (string), text (string), Buffer, Stream
module.exports.organizeImportsOf = function(input, whenChanged, whenFinished) {
  if (!input) return;
  let stringHandler = (string) => {
    let result;
    if (/^[^\s;'"]+$/.test(string)) {
      result = organizeImportsOfFile(/*filename=*/string, whenChanged, whenFinished);
    } else {
      let fileContents = string;
      result = organizeImportsOfText(fileContents);
      if (whenChanged && result && result !== fileContents) whenChanged(result, fileContents);
      if (whenFinished) whenFinished();
    }
    return result;
  };

  if (input instanceof Buffer) {
    return stringHandler( input.toString() );
  }
  if (typeof input === 'string') {
    return stringHandler(input);
  }
  if (input instanceof stream.Readable) {
    let stream = input;
    let data = '';
    stream.on('data', chunk => data += chunk.toString());
    stream.on('end', () => { stringHandler(data); });
    return null;
  }
  console.error( require('./Options').name + " doesn't know what to do with given input:", input);
  return null;
};

function organizeImportsOfFile(path, whenChanged, whenFinished) {
  if (!fileIO.lstatSync(path).isFile()) {
    if (!options.quiet) console.log('Not a file:', path);
    if (whenFinished) whenFinished();
    return null;
  }

  let fileContents = fileIO.readFileSync(path, {encoding:options.encoding});
  let organized    = organizeImportsOfText(fileContents);
  let normalize    = s => (s||'').replace( /\r\n|\r/g, '\n' );

  if (normalize(organized) !== normalize(fileContents)) {
    if (whenChanged) whenChanged(organized, fileContents);
    if (!options.dryRun && !options.validate) {
      try {
        fileIO.writeFileSync(path, organized, {encoding:options.encoding});
      } catch(error) {
        console.error('ERROR writing to: ' + path + '\n ==> ' + error);
      }
    }
    if (whenFinished) whenFinished();
    return organized;
  }
  if (whenFinished) whenFinished();
  return null;
}

function organizeImportsOfText(fileContents) {
  let tokenizer = new BasicTokenizer(fileContents);
  let tokens = tokenizer.tokenize();
  let iStart = -1;
  let expectLib = false;
  let imports = [];
  let beforeText = '';
  let restText = '';

  Options.lineCount += tokenizer.lineCount;

  for(let i=0; i<tokens.length; i++) {
    let token = tokens[i];

    if(iStart<0 || token.isRemark()) {
      if( "import" === token.text ) {
        iStart = i + 1; // skip import
        if (!imports.length) { beforeText = restText; restText = ''; }
      } else {
        restText += token.text;
      }
      if (iStart >= 0 && token.isRemark()) restText += '\n'; // add a newline after each remark in an import
    } else {
      let isSemicolon = ';' === token.text;

      if( isSemicolon || (expectLib && !token.noContent()) ) {
        if(token.isQuoted()) i++;
        let importText = [''];
        for(let ri=iStart; ri<i; ri++) {
            let rtoken = tokens[ri];
            if(!rtoken.isRemark()) {
              if (rtoken.text === 'from') importText.push('');
              else importText[importText.length-1] += rtoken.text;
            }
        }
        tokens.splice(iStart, i - iStart); // remove [iStart...i] from array
        i = iStart;
        iStart = -1;
        expectLib = false;
        imports.push( new Import(/*beforeFrom*/importText[0], /*afterFrom*/importText[1]) );
        if(token.isSpacing()) restText += '\n';
        while(i<tokens.length && (tokens[i].isSpacing() || tokens[i].text === ';')) i++; i--;
      } else {
        if( !expectLib && ("from" === token.text || token.isQuoted()) ) expectLib = true;
      }
    }
  }
  let importsText = Import.importsToString(imports).trim();

  let eol = (/^.*(\r\n|\r|\n)/.exec(fileContents)||[])[1] || '\n';
  let result = beforeText + importsText + (importsText ? '\n\n' : '') + restText.replace( /^\n*/, '' );
  if (eol != '\n') result = result.replace( /\r\n|\n/g, eol );
  return result;
}
