var UTF8 = require('../src/UTF8.js');
var assert = require('assert');

// Tests : http://en.wikipedia.org/wiki/UTF-8
describe('Decoding chars should work', function() {
  it('for 1 byte encoded chars in an array', function() {
    // [NUL]  U+0000  0    00000000  00
    assert.equal(UTF8.getCharCode([0x00]), 0x00);
    // [US]    U+001F  31  00011111  1F
    assert.equal(UTF8.getCharCode([0x1f]), 0x1f);
    // [SP]    U+0020  32  00100000  20
    assert.equal(UTF8.getCharCode([0x20]), 0x20);
    // A       U+0041  65  01000001  41
    assert.equal(UTF8.getCharCode([0x41]), 0x41);
    // ~      U+007E  126  01111110  7E
    assert.equal(UTF8.getCharCode([0x7e]), 0x7e);
    // [DEL]  U+007F  127  01111111  7F
    assert.equal(UTF8.getCharCode([0x7f]), 0x7f);
  });

  it('for 1 byte encoded chars in a TypedArray', function() {
    // [NUL]  U+0000  0    00000000  00
    assert.equal(UTF8.getCharCode(new Uint8Array([0x00])), 0x00);
    // [US]    U+001F  31  00011111  1F
    assert.equal(UTF8.getCharCode(new Uint8Array([0x1f])), 0x1f);
    // [SP]    U+0020  32  00100000  20
    assert.equal(UTF8.getCharCode(new Uint8Array([0x20])), 0x20);
    // A       U+0041  65  01000001  41
    assert.equal(UTF8.getCharCode(new Uint8Array([0x41])), 0x41);
    // ~      U+007E  126  01111110  7E
    assert.equal(UTF8.getCharCode(new Uint8Array([0x7e])), 0x7e);
    // [DEL]  U+007F  127  01111111  7F
    assert.equal(UTF8.getCharCode(new Uint8Array([0x7f])), 0x7f);
  });

  it('for 2 bytes encoded chars in an array', function() {
    // [PAD]  U+0080  128  (11000010 10000000)  (C2 80)
    assert.equal(UTF8.getCharCode([0xc2, 0x80]), 128);
    // [APC]  U+009F  159  (11000010 10011111)  (C2 9F)
    assert.equal(UTF8.getCharCode([0xc2, 0x9f]), 159);
    // [NBSP]  U+00A0  160  (11000010 10100000)  (C2 A0)
    assert.equal(UTF8.getCharCode([0xc2, 0xa0]), 160);
    // é      U+00E9  233  (11000011 10101001)  (C3 A9)
    assert.equal(UTF8.getCharCode([0xc3, 0xa9]), 233);
  });

  it('for 2 bytes encoded chars in a TypedArray', function() {
    // [PAD]  U+0080  128  (11000010 10000000)  (C2 80)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xc2, 0x80])), 128);
    // [APC]  U+009F  159  (11000010 10011111)  (C2 9F)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xc2, 0x9f])), 159);
    // [NBSP]  U+00A0  160  (11000010 10100000)  (C2 A0)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xc2, 0xa0])), 160);
    // é      U+00E9  233  (11000011 10101001)  (C3 A9)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xc3, 0xa9])), 233);
  });

  it('for 3 bytes encoded chars in an array', function() {
    // []  U+E000  57344  (11101110 10000000 10000000)  (EE 80 80)
    assert.equal(UTF8.getCharCode([0xee, 0x80, 0x80]), 57344);
    // []  U+F8FF  63743  (11101111 10100011 10111111)  (EF A3 BF)
    assert.equal(UTF8.getCharCode([0xef, 0xa3, 0xbf]), 63743);
    // 豈    U+F900  63744  (11101111 10100100 10000000)  (EF A4 80)
    assert.equal(UTF8.getCharCode([0xef, 0xa4, 0x80]), 63744);
    // []    U+FDD0  64976  (11101111 10110111 10010000)  (EF B7 90)
    assert.equal(UTF8.getCharCode([0xef, 0xb7, 0x90]), 64976);
    // []    U+FDEF  65007  (11101111 10110111 10101111)  (EF B7 AF)
    assert.equal(UTF8.getCharCode([0xef, 0xb7, 0x90]), 64976);
    // �    U+FFFD  65533  (11101111 10111111 10111101)  (EF BF BD)
    assert.equal(UTF8.getCharCode([0xef, 0xbf, 0xbd]), 65533);
    // []    U+FFFE  65534  (11101111 10111111 10111110)  (EF BF BE)
    assert.equal(UTF8.getCharCode([0xef, 0xbf, 0xbe]), 65534);
    // []    U+FFFF  65535  (11101111 10111111 10111111)  (EF BF BF)
    assert.equal(UTF8.getCharCode([0xef, 0xbf, 0xbf]), 65535);
  });

  it('for 3 bytes encoded chars in a TypedArray', function() {
    // []  U+E000  57344  (11101110 10000000 10000000)  (EE 80 80)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xee, 0x80, 0x80])), 57344);
    // []  U+F8FF  63743  (11101111 10100011 10111111)  (EF A3 BF)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xef, 0xa3, 0xbf])), 63743);
    // 豈    U+F900  63744  (11101111 10100100 10000000)  (EF A4 80)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xef, 0xa4, 0x80])), 63744);
    // []    U+FDD0  64976  (11101111 10110111 10010000)  (EF B7 90)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xef, 0xb7, 0x90])), 64976);
    // []    U+FDEF  65007  (11101111 10110111 10101111)  (EF B7 AF)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xef, 0xb7, 0x90])), 64976);
    // �    U+FFFD  65533  (11101111 10111111 10111101)  (EF BF BD)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xef, 0xbf, 0xbd])), 65533);
    // []    U+FFFE  65534  (11101111 10111111 10111110)  (EF BF BE)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xef, 0xbf, 0xbe])), 65534);
    // []    U+FFFF  65535  (11101111 10111111 10111111)  (EF BF BF)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xef, 0xbf, 0xbf])), 65535);
  });

  it('for 4 bytes encoded chars in an array', function() {
    // �    U+10000    65536    (11110000 10010000 10000000 10000000)  (F0 90 80 80)
    assert.equal(UTF8.getCharCode([0xf0, 0x90, 0x80, 0x80]), 65536);
    // []    U+10FFFF  1114111  (11110100 10001111 10111111 10111111)  (F4 8F BF BF)
    assert.equal(UTF8.getCharCode([0xf4, 0x8f, 0xbf, 0xbf]), 1114111);
    // []    U+1D306  119558  (11110000 10011101 10001100 10000110)  (F0 9D 8C 86)
    assert.equal(UTF8.getCharCode([0xf0, 0x9d, 0x8c, 0x86]), 119558);
  });

  it('for 4 bytes encoded chars in a TypedArray', function() {
    // �    U+10000    65536    (11110000 10010000 10000000 10000000)  (F0 90 80 80)
    assert.equal(
      UTF8.getCharCode(new Uint8Array([0xf0, 0x90, 0x80, 0x80])),
      65536
    );
    // []    U+10FFFF  1114111  (11110100 10001111 10111111 10111111)  (F4 8F BF BF)
    assert.equal(
      UTF8.getCharCode(new Uint8Array([0xf4, 0x8f, 0xbf, 0xbf])),
      1114111
    );
    // []    U+1D306  119558  (11110000 10011101 10001100 10000110)  (F0 9D 8C 86)
    assert.equal(
      UTF8.getCharCode(new Uint8Array([0xf0, 0x9d, 0x8c, 0x86])),
      119558
    );
  });
});

describe('Computing needed bytes should work', function() {
  function createCodepoint(numBits) {
    var bits = '';
    while (numBits) {
      bits += '1';
      numBits--;
    }
    return parseInt(bits, 2);
  }

  describe('for 1 byte codepoints', function() {
    [1, 2, 3, 4, 5, 6, 7].forEach(function(n) {
      it('with ' + n + ' bit codepoints', function() {
        assert.equal(UTF8.getBytesForCharCode(createCodepoint(n)), 1);
      });
    });
  });

  describe('for 2 bytes codepoints', function() {
    [8, 9, 10, 11].forEach(function(n) {
      it('with ' + n + ' bit codepoints', function() {
        assert.equal(UTF8.getBytesForCharCode(createCodepoint(n)), 2);
      });
    });
  });

  describe('for 3 bytes codepoints', function() {
    [12, 13, 14, 15, 16].forEach(function(n) {
      it('with ' + n + ' bit codepoints', function() {
        assert.equal(UTF8.getBytesForCharCode(createCodepoint(n)), 3);
      });
    });
  });

  describe('for 4 bytes codepoints', function() {
    [17, 18, 19, 20, 21].forEach(function(n) {
      it('with ' + n + ' bit codepoints', function() {
        assert.equal(UTF8.getBytesForCharCode(createCodepoint(n)), 4);
      });
    });
  });
});

describe('Encoding chars should work', function() {
  it('for 1 byte encoded chars', function() {
    var bytes = UTF8.setBytesFromCharCode('1'.charCodeAt(0));
    assert.equal(bytes.length, 1);
    assert.equal(bytes[0], 49);
  });

  it('for 2 bytes encoded chars', function() {
    let bytes = UTF8.setBytesFromCharCode('é'.charCodeAt(0));
    assert.equal(bytes.length, 2);
    assert.equal(bytes[0], 0xc3);
    assert.equal(bytes[1], 0xa9);
    bytes = UTF8.setBytesFromCharCode('ä'.charCodeAt(0));
    assert.equal(bytes.length, 2);
    assert.equal(bytes[0], 0xc3);
    assert.equal(bytes[1], 0xa4);
  });

  it('for 3 bytes encoded chars', function() {
    var bytes = UTF8.setBytesFromCharCode('€'.charCodeAt(0));
    assert.equal(bytes.length, 3);
    assert.equal(bytes[0], 0xe2);
    assert.equal(bytes[1], 0x82);
    assert.equal(bytes[2], 0xac);
  });

  it('for 4 bytes encoded chars', function() {
    var bytes = UTF8.setBytesFromCharCode(119558);
    assert.equal(bytes.length, 4);
    assert.equal(bytes[0], 0xf0);
    assert.equal(bytes[1], 0x9d);
    assert.equal(bytes[2], 0x8c);
    assert.equal(bytes[3], 0x86);
  });
});

describe('Encoding then decoding strings should work', function() {
  it('for this simple sentence', function() {
    assert.equal(
      UTF8.getStringFromBytes(['H'.charCodeAt(0), 'e'.charCodeAt(0)]),
      'He'
    );
  });

  it('for this simple sentence', function() {
    assert.equal(
      UTF8.getStringFromBytes(
        UTF8.setBytesFromString("J'avais gagné 15€ au tiercé !")
      ),
      "J'avais gagné 15€ au tiercé !"
    );
  });

  function compareFile(file, done) {
    var XMLHttpRequest =
      // eslint-disable-next-line
      'undefined' !== typeof global.XMLHttpRequest && global.XMLHttpRequest;
    if (XMLHttpRequest) {
      var oReq = new XMLHttpRequest();
      oReq.open('GET', '/base/tests/files/' + file, true);
      oReq.responseType = 'arraybuffer';
      oReq.onload = function() {
        var tReq = new XMLHttpRequest();
        tReq.open('GET', '/base/tests/files/' + file, true);
        tReq.onload = function() {
          var a = new Uint8Array(oReq.response);
          assert.equal(UTF8.getStringFromBytes(a), tReq.responseText);
          done();
        };
        tReq.send(null);
      };
      oReq.send(null);
    } else {
      var fs = require('fs');
      fs.readFile(__dirname + '/files/' + file, function(err, data) {
        var a = new Uint8Array(data);
        assert.equal(UTF8.getStringFromBytes(a), data.toString('utf-8'));
        done();
      });
    }
  }

  it('for Debian russian man pages', function(done) {
    compareFile('man-chown-ru.txt', done);
  });

  it('for Debian japanese man pages', function(done) {
    compareFile('man-whatis-ja.txt', done);
  });
});

describe('Encoding unencodable chars', function() {
  it('should raise an exception', function(done) {
    try {
      UTF8.getBytesForCharCode(0xffffffff);
    } catch (e) {
      done();
    }
  });
});

describe('Decoding bad strings should raise an exception', function() {
  it('with a bad first byte', function(done) {
    try {
      UTF8.getCharCode(new Uint8Array([0xf0, 0xff]), 0, 2);
    } catch (e) {
      done();
    }
  });

  it('with a bad second byte', function(done) {
    try {
      UTF8.getCharCode(new Uint8Array([0xc3, 0xf9]), 0, 2);
    } catch (e) {
      done();
    }
  });
});

describe('Decoding unterminated strings', function() {
  it('should silently fail', function() {
    assert.equal(UTF8.getStringFromBytes(new Uint8Array([0xf4, 0x8f])), '');
  });

  it('should raise an exception in strict mode', function(done) {
    try {
      UTF8.getStringFromBytes(new Uint8Array([0xf4, 0x8f]), null, null, true);
    } catch (e) {
      done();
    }
  });
});

describe('Encoding strings in a too small ArrayBuffer', function() {
  it('should silently fail', function() {
    var bytes = new Uint8Array(2);
    assert.equal(
      UTF8.getStringFromBytes(UTF8.setBytesFromString('1.3$ ~= 1€', bytes)),
      '1.'
    );
    assert.equal(
      UTF8.getStringFromBytes(UTF8.setBytesFromString('€', bytes)),
      ''
    );
    assert.equal(
      UTF8.getStringFromBytes(UTF8.setBytesFromString('1é', bytes)),
      '1'
    );
  });

  it('should fail when using strict mode', function() {
    try {
      var bytes = new Uint8Array(2);
      UTF8.setBytesFromString('1.3$ ~= 1€', bytes, null, null, true);
      throw 'Encoding a string in a too short ArrayBuffer in strict mode did' +
        ' not fail.';
    } catch (e) {
      if (
        'Not enought bytes to encode the char "3" at the offset "2".' !==
        e.message
      ) {
        throw e;
      }
    }
    try {
      bytes = new Uint8Array(2);
      UTF8.setBytesFromString('€', bytes, null, null, true);
      throw 'Encoding a string in a too short ArrayBuffer in strict mode did' +
        ' not fail.';
    } catch (e) {
      if (
        'Not enought bytes to encode the char "€" at the offset "0".' !==
        e.message
      ) {
        throw e;
      }
    }
    try {
      bytes = new Uint8Array(2);
      UTF8.setBytesFromString('1é', bytes, null, null, true);
      throw 'Encoding a string in a too short ArrayBuffer in strict mode did' +
        ' not fail.';
    } catch (e) {
      if (
        'Not enought bytes to encode the char "é" at the offset "1".' !==
        e.message
      ) {
        throw e;
      }
    }
  });
});

describe('Detecting the encoding', function() {
  it('should work with valid utf-8', function() {
    assert.equal(UTF8.isNotUTF8(UTF8.setBytesFromString('€')), false);
  });

  it('should fail with non UTF-8', function() {
    assert.equal(
      UTF8.isNotUTF8(new Uint8Array([0xc0, 0x90, 0x80, 0x01])),
      true
    );
  });
});
