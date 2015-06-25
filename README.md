# UTF8.js
> A simple JavaScript library to encode/decode UTF8 strings.

[![NPM version](https://badge.fury.io/js/utf-8.svg)](https://npmjs.org/package/utf-8) [![Build status](https://secure.travis-ci.org/nfroidure/UTF8.js.svg)](https://travis-ci.org/nfroidure/UTF8.js) [![Dependency Status](https://david-dm.org/nfroidure/UTF8.js.svg)](https://david-dm.org/nfroidure/UTF8.js) [![devDependency Status](https://david-dm.org/nfroidure/UTF8.js/dev-status.svg)](https://david-dm.org/nfroidure/UTF8.js#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/nfroidure/UTF8.js/badge.svg?branch=master)](https://coveralls.io/r/nfroidure/UTF8.js?branch=master)

## Encoding

A char:
```js
UTF8.setBytesFromCharCode('é'.charCodeAt(0));
// [0xC3, 0xA9]
```

A string:
```js
UTF8.setBytesFromString('1.3$ ~= 1€');
// [49, 46, 51, 36, 32, 126, 61, 32, 49, 226, 130, 172]
```

## Decoding

A char:
```js
String.fromCharCode(UTF8.getCharCode([0xC3, 0xA9]);
// 'é'
```

A string:
```js
UTF8.getStringFromBytes([49, 46, 51, 36, 32, 126, 61, 32, 49, 226, 130, 172]);
// '1.3$ ~= 1€'
```

## TypedArrays are welcome

As inputs :
```js
var bytes=new Uint8Array([0xC3, 0xA9, 49, 46, 51, 36, 32, 126, 61, 32, 49, 226, 130, 172]);

// The first char
String.fromCharCode(UTF8.getCharCode(bytes));
// é

// The following string at the offset 2
UTF8.getStringFromBytes(bytes,2);
// '1.3$ ~= 1€'
```
As well as outputs :
```js
var bytes=new Uint8Array(14);

// First encoding a char
UTF8.setBytesFromCharCode('é'.charCodeAt(0));

// Then encoding a string
UTF8.setBytesFromString('1.3$ ~= 1€', 2);
```

## UTF8 encoding detection
```js
UTF8.isNotUTF8(bytes);
// true | false
```
This function can prove the text contained by the given bytes is not UTF-8
 (or badly encoded UTF-8 string). It's not reciprocally true, especially for
 short strings with which false positives are frequent.

## Strict mode
If you try to encode an UTF8 string in an ArrayBuffer too short to contain the
 complete string, it will silently fail. To avoid this behavior, use the strict
 mode :

```js
UTF8.setBytesFromString('1.3$ ~= 1€', 2, null, true);
```

## NodeJS

Also available on NPM :
```sh
npm install utf-8
```

# Thanks
- The Debian project for it's free (as freedom) russian/japanese man pages
 used for real world files tests !

## Stats
[![NPM](https://nodei.co/npm/ttf2woff2.png?downloads=true&stars=true)](https://nodei.co/npm/ttf2woff2/)
[![NPM](https://nodei.co/npm-dl/ttf2woff2.png)](https://nodei.co/npm/ttf2woff2/)
