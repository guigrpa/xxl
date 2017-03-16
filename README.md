# xxl [![npm version](https://img.shields.io/npm/v/xxl.svg)](https://www.npmjs.com/package/xxl)

LOC statistics for multiple directories

## Why?

Wraps [*sloc*](https://github.com/flosse/sloc) and processes multiple directories, providing individual and aggregated statistics.


## Installation

```
$ npm install --save-dev xxl
```


## Usage

```
  Usage: xxl [options]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    --src [srcDirs]              source directories (comma-separated)
    -e, --exclude [excludeDirs]  excluded path fragments (comma-separated)
```

You can also add it to your `package.json`:

```json
...
"scripts": {
    "xxl": "xxl --src client,server",
    ...
},
...
```


## [Changelog](https://github.com/guigrpa/xxl/blob/master/CHANGELOG.md)


## License (MIT)

Copyright (c) [Guillermo Grau Panea](https://github.com/guigrpa) 2016-present

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
