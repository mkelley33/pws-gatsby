const shell = require('shelljs');

// TODO: git checkout a tag or branch passed as args to this script.
// TODO: run server tests and if they fail, then fail the build.
shell.rm('-rf', 'dist');

shell.exec('babel . --out-dir dist --ignore node_modules,public,test,scripts');
shell.cp('.env', 'dist');
shell.exec('npm shrinkwrap');
shell.mv('npm-shrinkwrap.json', 'dist');

// shell.cd('../client');
// // TODO: fail the build if test or lint error, but figure out a way to ignore deprecation warnings.
// shell.exec('npm run test');
// shell.exec('npm run lint');
// shell.exec('npm run build');
// shell.exec('mkdir -p ../server/dist/public');
// shell.cp('-R', 'dist/*', '../server/dist/public');
