'use strict'
const version = '1.0';
const name = 'organize-js-imports';
const author = 'Nicolas de Jong <nicolas@rutilo.nl>';

module.exports = {
  version: version,
  name: name,
  author: author,
  options: {}, // set by processArgs
  defaults : {
    maxNamesLength: 30,
    path: '**/*.js',
    quiet: false,
    debug: false,
    dryRun: false,
    pathQuote: "'",
    namesJoin: ', ',
    encoding: 'utf8'
  },
  alias : {
    maxnameslength:     'maxNamesLength',
    maxnamelength:      'maxNamesLength',
    maxNameLength:      'maxNamesLength',
    'max-names-length': 'maxNamesLength',
    paths: 'path',
    dryrun:    'dryRun',
    'dry-run': 'dryRun',
  },
  help: `
    ${name} V${version} by ${author}
    Possible arguments:
    -maxNamesLength (default:30) Name padding max. Set to 0 for no padding.
    -path[s]        (default:**/*.js) One or more globs for files to process.
    -encoding       (default:utf8) Encoding for reading and writing files.
    -quiet          Don't print anything except errors.
    -verbose        Print the name of each scanned file.
    -debug          Print the name and altered imports of each scanned file.  
    -dryRun         Files will not be altered.
  `,
  processArgs : args => {
    if (!args) args = process.argv.slice(2);
    let options = module.exports.options = Object.assign( {}, module.exports.defaults );
    let alias   = module.exports.alias;
    let i = 0;
    while (i<args.length) {
      let key0 = args[i].replace(/^-+/,'');
      let key = alias[key0] || key0;
      if (!(key in module.exports.defaults) && !args.find(a=>a==='test')) {
        printHelpAndExit('Unsupported parameter: ' + key0 + '\nParameters:' + args.join(', '));
      }
      let val = [];
      i++;
      while (i<args.length && !/^-.*/.test(args[i]) ) { val.push(args[i]); i++; }
      options[key] = val.length == 0 ? true : val.length == 1 ? val[0] : val;
    }
    options.path = Array.isArray(options.path) ? options.path : [options.path];
    if (options.h || options.help || options['?']) module.exports.printHelpAndExit();
    if (options.debug) {
      console.log(`${name} V${version}`);

      console.log('Provided options:');
      console.log('{');
      Object.keys(options).forEach( key => console.log( '  ' + key + ': ' + options[key] ) );
      console.log('}');
    }
  }
};

function printHelpAndExit(error) {
  if (error) console.error(error);
  console.log(module.exports.help.trim().replace( /\n\s+/g, '\n' ));
  process.exit(0);
}

module.exports.processArgs();
