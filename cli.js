#!/usr/bin/env node
const path = require('path');
const meow = require('meow');
const chalk = require('chalk');
const readline = require('readline');
const logUpdate = require('log-update');
const fuzzyGlob = require('fuzzy-glob');
const debounce = require('lodash.debounce');

const cli = meow(`
  Usage
    $ quick-find <[option]> <tokens>
      Tokens can be:
        One or more words to use for fuzzy search.
        Interactive UI will be launch if none tokens is provided.

  Options
    --glob          Specific files indicated by glob patterns (https://github.com/isaacs/node-glob#glob-primer).
    --relative, -r  Results will be return as relative path.

  Examples
    $ quick-find
    $ quick-find --glob "./images/**/*.png"
    $ quick-find src util js
    $ quick-find --glob "./images/**/*.png" src cat
`, {
  boolean: ['relative'],
  alias: {
    r: 'relative'
  }
});

const target = cli.flags.glob || process.cwd() + '/**/*';
const fuse = fuzzyGlob(target);
const passer = f => cli.flags.relative ? path.relative(process.cwd(), f) : f;

if (cli.input.length > 0) {
  const result = fuse.search(cli.input.join(' '));
  console.log(result.map(m => m.file).map(passer).join('\n'));
  return;
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const debouncer = debounce(cb => cb(), 200);
const limit = 10;
const pre = `${chalk.bold.cyan('›')} `;
const query = [];
let prevResult = [];
let select = 0;
let viewIndex = 0;

logResult();

process.stdin.on('keypress', (ch, key) => {
  key = key || {};

  if (key.name === 'left' || key.name === 'right') {
    return;
  }

  if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
    if (query.length <= 1) {
      logUpdate();
      readline.moveCursor(process.stdout, 0, -1);
    }

    process.exit();
  }

  if (key.name === 'return') {
    logUpdate();
    console.log(prevResult.find((file, index) => index === select));
    process.exit();
  }

  if (key.name === 'backspace') {
    query.pop();
  } else if (key.name === 'return' || (key.ctrl && key.name === 'u')) {
    query.length = 0;
  } else if (key.name === 'up') {
    select = Math.max(select - 1, 0);
    if (select < viewIndex) {
      viewIndex--;
    }
  } else if (key.name === 'down') {
    select = Math.min(select + 1, prevResult.length - 1);
    if (select >= viewIndex + limit) {
      viewIndex++;
    }
  } else {
    query.push(ch);
  }
  
  logResult();

  if (!(key.name === 'up' || key.name === 'down')) {
    debouncer(() => {
      prevResult = fuse.search(query.join('')).map(m => m.file);
      select = viewIndex = 0;
      logResult();
    });
  }
});

function logResult() {
  const indicator = prevResult.length > 1 ? `${select + 1}/${prevResult.length}` : '';
  const finalResult = prevResult.map((file, index) => {
    return index === select ? chalk.black.bgWhite(file) : file;
  });

  logUpdate(`
  ${pre}${chalk.bold(query.join(''))}
  ${viewIndex > 0 ? chalk.yellow('▲') : ''}
  ${finalResult.slice(viewIndex, viewIndex + limit).map(passer).join('\n') || ''}
  ${viewIndex + limit < prevResult.length ? chalk.yellow('▼') : ''}
  ${indicator}
  `);
}