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