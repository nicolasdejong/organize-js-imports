'use strict'
let pak = require('../package.json');

module.exports = {
  version: pak.version,
  name: pak.name,
  author: pak.author,
  options: {}, // set by processArgs
  lineCount: 0,
  defaults : {
    maxNamesLength: 30,
    path: '**/*.js',
    exclude: ['**/node_modules/**', '**/jspm_packages/**'],
    quiet: false,
    debug: false,
    dryRun: false,
    validate: false,
    pathQuote: "'",
    namesJoin: ', ',
    encoding: 'utf8',
    h:'', help:'', '?':''
  },
  alias : {
    maxnameslength:     'maxNamesLength',
    maxnamelength:      'maxNamesLength',
    maxNameLength:      'maxNamesLength',
    'max-names-length': 'maxNamesLength',
    paths: 'path',
    excludes: 'exclude',
    dryrun:    'dryRun',
    'dry-run': 'dryRun',
  },
  help: `
    ${pak.name} V${pak.version} by ${pak.author}
    Possible arguments:
    -maxNamesLength (default:30) Name padding max. Set to 0 for no padding.
    -path[s]        (default:**/*.js) One or more globs for files to process.
    -exclude[s]     (default:**/node_modules/** **/jspm_package/**)
    >               One or more globs for files to exclude.
    -encoding       (default:utf8) Encoding for reading and writing files.
    -quiet          Don't print anything except errors.
    -verbose        Print the name of each scanned file.
    -debug          Print the name and altered imports of each scanned file.  
    -dryRun         Files will not be altered.
    -validate       Exits 10 when files need organizing. Files will not be altered.
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
    if (options.h || options.help || options['?']) printHelpAndExit();
    if (options.debug) {
      console.log(`${pak.name} V${pak.version}`);

      console.log('Provided options:');
      console.log('{');
      Object.keys(options).forEach( key => console.log( '  ' + key + ': ' + options[key] ) );
      console.log('}');
    }
  }
};

function printHelpAndExit(error) {
  if (error) console.error(error);
  console.log(module.exports.help.trim().replace( /\n\s+/g, '\n' ).replace( /^>/m, ' ' ));
  process.exit(0);
}

module.exports.processArgs();
