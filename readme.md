# quick-find

> A interactive command to find file quickly⚡️. Like `quick-open` in Visual Studio Code.

<img src="screenshot.gif" width="443">

## Install

```
$ npm install --global quick-find
```


## Usage

```sh
$ quick-find --help

  Usage
      $ quick-find <[option]> <tokens>
      Tokens can be:
          One or more words to use for fuzzy search.
          Interactive UI will be launch if none tokens is provided.

  Options
      --glob Specific files indicated by glob patterns (https://github.com/isaacs/node-glob#glob-primer).

  Examples
      $ quick-find
      $ quick-find --glob "./images/**/*.png"
      $ quick-find src util js
      $ quick-find --glob "./images/**/*.png" src cat
```

## License

MIT © [Paul Young](https://github.com/thammin)
