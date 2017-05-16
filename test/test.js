const test = require('ava');
const path = require('path');
const { exec } = require('child_process');

const bin = path.resolve(__dirname, '../cli.js');
const fixture = path.resolve(__dirname, './fixture');

test.cb('log out the result if tokens is provided.', t => {
  exec(`${bin} --glob ${fixture + '/**/*'} cat .png`, (err, stdout) => {
    t.ifError(err);
    
    stdout
      .split('\n')
      .filter(f => f)
      .forEach(line => t.regex(line, /cat/));

    t.end();
  });
});

test.cb('works on current directory if no glob option is provided.', t => {
  exec(`${bin} cat .png`, (err, stdout) => {
    t.ifError(err);
    
    stdout
      .split('\n')
      .filter(f => f)
      .forEach(line => t.regex(line, /cat/));

    t.end();
  });
});

test.cb('return all results as absolute path.', t => {
  exec(`${bin} dog`, (err, stdout) => {
    t.ifError(err);
    t.regex(stdout, /^\/.*\/dog\.png/);
    t.end();
  });
});

test.cb('return all results as relative path if --relative is passed as arguments.', t => {
  exec(`${bin} --relative dog`, (err, stdout) => {
    t.ifError(err);
    t.regex(stdout, /^test\/fixture\/dog\.png/);
    t.end();
  });
});