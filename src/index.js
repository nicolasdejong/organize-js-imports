'use strict'
let globby    = require('globby');
let minimatch = require('minimatch');
let Options   = require('./Options');
let Organizer = require('./OrganizeImports');
let tokenizer = require('./BasicTokenizer');

processPaths(Options.options);

function processPaths(options) {
  let fileCount = 0;
  let alteredCount = 0;
  let internalErrorCount = 0;
  let t1 = new Date().getTime();
  let t2;

  if (options.debug) console.log('Scanning filesystem...');
  if (options.dryRun && !options.quiet && !options.validate) console.log('Dry run: no files will be altered.');
  if (options.validate && !options.quiet) console.log('Validate: searching for files that need organizing.');

  globby(options.path).then(paths => {
    t2 = new Date().getTime();
    if (options.debug) console.log('Filesystem scan resulted in ' + paths.length + ' files, took ' + msToTimeText(t2-t1));

    paths = excludePaths(paths, options.exclude);
    if (options.debug) console.log('Scanning ' + paths.length + ' files.');

    let n = 0;
    paths.forEach( path => {
      n++;
      if (options.debug) {
        console.log('Scan: ' + path);
      }
      try {
        fileCount++;
        if (processPath(path, options, n, paths.length)) alteredCount++;
      } catch(e) {
        internalErrorCount++;
        console.error('Internal error:', e);
      }
    });
  }).then( () => {
    if(!options.quiet) {
      let t3 = new Date().getTime();
      console.log('organize-js-imports '
                + (options.dryRun || options.validate ? 'would have ' : '')
                + 'altered ' + alteredCount + ' of ' + fileCount + ' files. '
                + 'Scanned ' + linesToText(Options.lineCount) + ' lines in ' + msToTimeText(t3-t2));
    }
    if(internalErrorCount>0) console.log('Encountered ' + internalErrorCount + ' internal errors(!)');
    if(options.validate && alteredCount) {
      process.exit(10);
    }
    process.exit(0);
  }).catch( error => {
    console.error('FAILED WITH ERROR:', error);
    process.exit(-1);
  });
};

function processPath(path, options, n, pathCount) {
  let altered = false;
  Organizer.organizeImportsOfFile( path, (organized, original) => {
    altered = true;
    if (options.debug) {
      console.log('Organized imports:');
      console.log( ((/((^|\n+)import[^]+?;(?=\n+))+/g.exec( normalize(organized) )||[])[0] || 'no imports?').trim() );
    } else if (!options.quiet) {
      console.log( n + '/' + pathCount + ' -- ' + (options.validate ? 'Needs organizing' : 'Organized imports of') + ': ' + path);
    }
  });
  return altered;
}

function excludePaths(paths, excludes) {
  if (!excludes ) return;
  if (!Array.isArray(excludes)) excludes = [excludes];
  return paths.filter( path => !excludes.find( exclude => minimatch(path, exclude) ) );
}

function normalize(s) {
  return (s||'').replace( /\r\n|\r/g, '\n' );
}

function msToTimeText(ms) {
  if (ms < 1000 * 5) return ms + " ms";
  let padded = n => (n < 10 ? '0' : '') + n;
  let s = Math.round(ms / 1000);
  if (s < 100) return s + " s";
  let m = Math.round(s / 60); s = s % 60;
  if (m < 100) return m + ':' + padded(s);
  let h = Math.round(m / 60); m = m % 60;
  return h + ':' + padded(m) + ':' + padded(s);
}
function linesToText(count) {
  if (count > 10 * 1000 * 1000) return Math.round(count / (1000 * 100)) / 10 + 'M';
  if (count > 10 * 1000) return Math.floor(count / 1000) + 'K';
  return '' + count;
}