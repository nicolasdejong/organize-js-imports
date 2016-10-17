'use strict'
let globby    = require('globby');
let Organizer = require('./OrganizeImports');

processPaths(require('./Options').options);


function processPaths(options) {
  let fileCount = 0;
  let alteredCount = 0;
  globby(options.path).then(paths => {
    if (options.dryRun) console.log('Dry run: no files will be altered.');
    if (options.debug)  console.log('Scanning ' + paths.length + ' files.');

    paths.forEach( path => {
      if (options.debug) {
        console.log('Scan: ' + path);
      }
      try {
        fileCount++;
        if (process(path, options)) alteredCount++;
      } catch(e) {
        console.error('Internal error:', e);
      }
    });
  }).then( () => {
    if(!options.quiet) {
      console.log('organize-js-imports altered ' + alteredCount + ' of ' + fileCount + ' files.');
    }
  });
};

function process(path, options) {
  let altered = false;
  Organizer.organizeImportsOfFile( path, (organized, original) => {
    altered = true;
    if (options.debug) {
      console.log('Organized imports:');
      console.log( ((/((^|\n+)import[^]+?;(?=\n+))+/g.exec( normalize(organized) )||[])[0] || 'no imports?').trim() );
    } else if (!options.quiet) {
      console.log('Organized imports of: ' + path);
    }
  });
  return altered;
}

function normalize(s) {
  return (s||'').replace( /\r\n|\r/g, '\n' );
}
