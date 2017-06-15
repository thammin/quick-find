# quick-find

> A interactive command to find file quickly⚡️. Like `quick-open` in Visual Studio Code.

<img src="screenshot.gif" width="443">

## Install

```
$ npm install --global quick-find
```


## Usage

```
$ quick-find --help

  Usage
      $ quick-find <[option]> <tokens>
      Tokens can be:
          One or more words to use for fuzzy search.
          Interactive UI will be launch if none tokens is provided.

  Options
      --glob Specific files indicated by glob patterns (https://github.com/isaacs/node-glob#glob-primer).
      --relative, -r  Results will be return as relative path.
      --cwd           Change the current working directory.

  Examples
      $ quick-find
      $ quick-find --glob "./images/**/*.png"
      $ quick-find src util js
      $ quick-find --glob "./images/**/*.png" src cat
```

#### Using programmatically

```js
const quickFind = require('quick-find');
const option = {
    glob: './iamges/**/*.png',
    relative: true
};

quickFind(option)
    .then(result => {
        console.log(result);
        // -> result will be the one you choose
    });
```

## License

MIT © [Paul Young](https://github.com/thammin)
