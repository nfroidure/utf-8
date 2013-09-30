# UTF8.js [![Build Status](https://travis-ci.org/nfroidure/UTF8.js.png?branch=master)](https://travis-ci.org/nfroidure/UTF8.js)

A simple JavaScript library to encode/decode UTF8 strings.

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
UTF8.isUTF8(bytes);
// true | false
```

## NodeJS

Also available on NPM :
```sh
npm install utf-8
```

# Thanks
- The Debian project for it's free (as freedom) russian/japanese man pages
 used for real world files tests !
