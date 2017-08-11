#!/usr/bin/env node

const program = require('commander');
const ProgressBar = require('progress');
const shell = require('shelljs');
const ora = require('ora');
const wget = require('./wget');
const fs = require('fs');
const got = require('got');


if (!shell.which('wget')) {
  shell.echo('Sorry, this script requires wget');
  shell.echo(`Install wget for ${os.platform()}`);
  shell.exit(1);
}

program
  .version('0.1.0')
  .option('-u, --url [file_url]', 'Add the specified type of cheese [marble]', 'marble')
  .option('-p, --path [directory]', 'Download to specified directory [.]', '.')
  .parse(process.argv);

// console.log(program)
console.log('URL: ', program.url);
console.log('To: ', program.path);

const foreverRetry = `
    while [ 1 ]; do
        wget --retry-connrefused --waitretry=1 --read-timeout=20 --timeout=15 -t 0 -q --show-progress --continue -P ${program.path || '.'} ${program.url}
        if [ $? = 0 ]; then break; fi;
        sleep 1s;
    done;
`;

const spinner = ora('Downloading').start();

// GOT

// got(program.url)
// 	.on('downloadProgress', progress => {
//     console.log(progress)
// 		// Report download progress
// 	})
// 	.then(response => {
//     console.log(response)
// 		// Done
// 	});


// WGET-JS

// wget('http://nodejs.org/images/logo.svg').then(res => console.log('RES', res));
// (async () => {
//   const dl = await wget('http://nodejs.org/images/logo.svg');
//   console.log('Done');
//   console.log(dl);
// })();

// WGET

let download = shell.exec(foreverRetry, {
  async: true
});
download.stdout.on('data', (data) => {
  console.log(data);
});

// shell.exec(foreverRetry, (code, stderr, stdout) => {
//   console.log('Exit code:', code);
//   console.log('Program output:', stdout);
//   console.log('Program stderr:', stderr);
// });
