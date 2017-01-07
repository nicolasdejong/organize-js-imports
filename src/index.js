'use strict';
let globby     = require('globby');
let minimatch  = require('minimatch');
let moment     = require('moment');
let Options    = require('./Options');
let Organizer  = require('./OrganizeImports');
let filesystem = require('fs');
let exec       = require('child_process').exec;

if (Options.options.gitModified) {
  exec('git status', (err, data, stderr) => {
    if (err && stderr) {
      console.error('Unable to run git:', stderr);
      return;
    }
    Options.options.path = String(data).match( /:\s+(.+\.js)\s/g ).map( m => m.substring(1).trim() );
    processPaths(Options.options);
  });
} else {
  processPaths(Options.options);
}

function processPaths(options) {
  let fileCount = 0;
  let alteredCount = 0;
  let internalErrorCount = 0;
  let t1 = new Date().getTime();
  let t2;

  if (options.debug) console.log('Scanning filesystem...');
  if (options.dryRun && !options.quiet && !options.validate) console.log('Dry run: no files will be altered.');
  if (options.validate && !options.quiet) console.log('Validate: searching for files that need organizing.');

  globby(options.path, { ignore: options.exclude || false }).then(paths => {
    t2 = new Date().getTime();
    if (options.debug) console.log('Filesystem scan resulted in ' + paths.length + ' files, took ' + msToTimeText(t2-t1));
    paths = excludePaths(paths, options);
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
}

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

function excludePaths(paths, options) {
  let recent = optionToMoment(options.recent);
  let older  = optionToMoment(options.older);
  return paths
           .filter( path => {
             if (recent || older) {
               let stat = filesystem.statSync(path);
               let time = moment((stat || {}).mtime || 0);
               if (recent && !time.isAfter(recent)) return false;
               if (older  && !time.isBefore(older)) return false;
             }
             return true;
           } );
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
function optionToMoment(setting) { // return null when no setting
  if (!setting) return null;
  if (!Array.isArray(setting)) setting = [setting];
  if (setting.length === 0 ) return moment(0);
  if (setting.length === 1 ) setting.push('days');
  if (setting[1].length > 2) { // DAY -> day, day -> days
    setting[1] = setting[1].toLowerCase();
    if (!/^.*s$/.test(setting[1])) setting[1] += 's';
  }
  return moment().subtract( moment.duration(parseInt(setting[0]), setting[1]) );
}
