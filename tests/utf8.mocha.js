var assert = {
    equal: function(a,b) {
      if(a!==b) {
        throw Error(JSON.stringify(a)+' differs from '+JSON.stringify(b));
      }
    }
  }
  , UTF8 = (
    global && global.UTF8
    ? global.UTF8
    : require(__dirname + '/../src/UTF8.js')
  )
;

// Tests : http://en.wikipedia.org/wiki/UTF-8
describe('Decoding chars should work', function(){

  it('for 1 byte encoded chars in an array', function() {
    // [NUL]  U+0000  0    00000000  00
    assert.equal(UTF8.getCharCode([0x00]), 0x00);
    // [US]    U+001F  31  00011111  1F
    assert.equal(UTF8.getCharCode([0x1F]), 0x1F);
    // [SP]    U+0020  32  00100000  20
    assert.equal(UTF8.getCharCode([0x20]), 0x20);
    // A       U+0041  65  01000001  41
    assert.equal(UTF8.getCharCode([0x41]), 0x41);
    // ~      U+007E  126  01111110  7E
    assert.equal(UTF8.getCharCode([0x7E]), 0x7E);
    // [DEL]  U+007F  127  01111111  7F
    assert.equal(UTF8.getCharCode([0x7F]), 0x7F);
  });

  it('for 1 byte encoded chars in a TypedArray', function() {
    // [NUL]  U+0000  0    00000000  00
    assert.equal(UTF8.getCharCode(new Uint8Array([0x00])), 0x00);
    // [US]    U+001F  31  00011111  1F
    assert.equal(UTF8.getCharCode(new Uint8Array([0x1F])), 0x1F);
    // [SP]    U+0020  32  00100000  20
    assert.equal(UTF8.getCharCode(new Uint8Array([0x20])), 0x20);
    // A       U+0041  65  01000001  41
    assert.equal(UTF8.getCharCode(new Uint8Array([0x41])), 0x41);
    // ~      U+007E  126  01111110  7E
    assert.equal(UTF8.getCharCode(new Uint8Array([0x7E])), 0x7E);
    // [DEL]  U+007F  127  01111111  7F
    assert.equal(UTF8.getCharCode(new Uint8Array([0x7F])), 0x7F);
  });

  it('for 2 bytes encoded chars in an array', function() {
    // [PAD]  U+0080  128  (11000010 10000000)  (C2 80)
    assert.equal(UTF8.getCharCode([0xC2, 0x80]), 128);
    // [APC]  U+009F  159  (11000010 10011111)  (C2 9F)
    assert.equal(UTF8.getCharCode([0xC2, 0x9F]), 159);
    // [NBSP]  U+00A0  160  (11000010 10100000)  (C2 A0)
    assert.equal(UTF8.getCharCode([0xC2, 0xA0]), 160);
    // é      U+00E9  233  (11000011 10101001)  (C3 A9)
    assert.equal(UTF8.getCharCode([0xC3, 0xA9]), 233);
  });

  it('for 2 bytes encoded chars in a TypedArray', function() {
    // [PAD]  U+0080  128  (11000010 10000000)  (C2 80)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xC2, 0x80])), 128);
    // [APC]  U+009F  159  (11000010 10011111)  (C2 9F)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xC2, 0x9F])), 159);
    // [NBSP]  U+00A0  160  (11000010 10100000)  (C2 A0)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xC2, 0xA0])), 160);
    // é      U+00E9  233  (11000011 10101001)  (C3 A9)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xC3, 0xA9])), 233);
  });

  it('for 3 bytes encoded chars in an array', function() {
    // []  U+E000  57344  (11101110 10000000 10000000)  (EE 80 80)
    assert.equal(UTF8.getCharCode([0xEE, 0x80, 0x80]), 57344);
    // []  U+F8FF  63743  (11101111 10100011 10111111)  (EF A3 BF)
    assert.equal(UTF8.getCharCode([0xEF, 0xA3, 0xBF]), 63743);
    // 豈    U+F900  63744  (11101111 10100100 10000000)  (EF A4 80)
    assert.equal(UTF8.getCharCode([0xEF, 0xA4, 0x80]), 63744);
    // []    U+FDD0  64976  (11101111 10110111 10010000)  (EF B7 90)
    assert.equal(UTF8.getCharCode([0xEF, 0xB7, 0x90]), 64976);
    // []    U+FDEF  65007  (11101111 10110111 10101111)  (EF B7 AF)
    assert.equal(UTF8.getCharCode([0xEF, 0xB7, 0x90]), 64976);
    // �    U+FFFD  65533  (11101111 10111111 10111101)  (EF BF BD)
    assert.equal(UTF8.getCharCode([0xEF, 0xBF, 0xBD]), 65533);
    // []    U+FFFE  65534  (11101111 10111111 10111110)  (EF BF BE)
    assert.equal(UTF8.getCharCode([0xEF, 0xBF, 0xBE]), 65534);
    // []    U+FFFF  65535  (11101111 10111111 10111111)  (EF BF BF)
    assert.equal(UTF8.getCharCode([0xEF, 0xBF, 0xBF]), 65535);
  });

  it('for 3 bytes encoded chars in a TypedArray', function() {
    // []  U+E000  57344  (11101110 10000000 10000000)  (EE 80 80)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xEE, 0x80, 0x80])), 57344);
    // []  U+F8FF  63743  (11101111 10100011 10111111)  (EF A3 BF)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xA3, 0xBF])), 63743);
    // 豈    U+F900  63744  (11101111 10100100 10000000)  (EF A4 80)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xA4, 0x80])), 63744);
    // []    U+FDD0  64976  (11101111 10110111 10010000)  (EF B7 90)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xB7, 0x90])), 64976);
    // []    U+FDEF  65007  (11101111 10110111 10101111)  (EF B7 AF)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xB7, 0x90])), 64976);
    // �    U+FFFD  65533  (11101111 10111111 10111101)  (EF BF BD)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xBF, 0xBD])), 65533);
    // []    U+FFFE  65534  (11101111 10111111 10111110)  (EF BF BE)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xBF, 0xBE])), 65534);
    // []    U+FFFF  65535  (11101111 10111111 10111111)  (EF BF BF)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xBF, 0xBF])), 65535);
  });

  it('for 4 bytes encoded chars in an array', function() {
    // �    U+10000    65536    (11110000 10010000 10000000 10000000)  (F0 90 80 80)
    assert.equal(UTF8.getCharCode([0xF0, 0x90, 0x80, 0x80]), 65536);
    // []    U+10FFFF  1114111  (11110100 10001111 10111111 10111111)  (F4 8F BF BF)
    assert.equal(UTF8.getCharCode([0xF4, 0x8F, 0xBF, 0xBF]), 1114111);
    // []    U+1D306  119558  (11110000 10011101 10001100 10000110)  (F0 9D 8C 86)
    assert.equal(UTF8.getCharCode([0xF0, 0x9D, 0x8C, 0x86]), 119558);
  });

  it('for 4 bytes encoded chars in a TypedArray', function() {
    // �    U+10000    65536    (11110000 10010000 10000000 10000000)  (F0 90 80 80)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xF0, 0x90, 0x80, 0x80])), 65536);
    // []    U+10FFFF  1114111  (11110100 10001111 10111111 10111111)  (F4 8F BF BF)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xF4, 0x8F, 0xBF, 0xBF])), 1114111);
    // []    U+1D306  119558  (11110000 10011101 10001100 10000110)  (F0 9D 8C 86)
    assert.equal(UTF8.getCharCode(new Uint8Array([0xF0, 0x9D, 0x8C, 0x86])), 119558);
  });

});

describe('Computing needed bytes should work', function(){

  function createCodepoint(numBits) {
    var bits = '';
    while(numBits) {
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

describe('Encoding chars should work', function(){

  it('for 1 byte encoded chars', function() {
    var bytes=UTF8.setBytesFromCharCode('1'.charCodeAt(0));
    assert.equal(bytes.length, 1);
    assert.equal(bytes[0], 49);
  });

  it('for 2 bytes encoded chars', function() {
    var bytes=UTF8.setBytesFromCharCode('é'.charCodeAt(0));
    assert.equal(bytes.length, 2);
    assert.equal(bytes[0], 0xC3);
    assert.equal(bytes[1], 0xA9);
    var bytes=UTF8.setBytesFromCharCode('ä'.charCodeAt(0));
    assert.equal(bytes.length, 2);
    assert.equal(bytes[0], 0xC3);
    assert.equal(bytes[1], 0xA4);
  });

  it('for 3 bytes encoded chars', function() {
    var bytes=UTF8.setBytesFromCharCode('€'.charCodeAt(0));
    assert.equal(bytes.length, 3);
    assert.equal(bytes[0], 0xE2);
    assert.equal(bytes[1], 0x82);
    assert.equal(bytes[2], 0xAC);
  });

  it('for 4 bytes encoded chars', function() {
    var bytes=UTF8.setBytesFromCharCode(119558);
    assert.equal(bytes.length, 4);
    assert.equal(bytes[0], 0xF0);
    assert.equal(bytes[1], 0x9D);
    assert.equal(bytes[2], 0x8C);
    assert.equal(bytes[3], 0x86);
  });

});

describe('Encoding then decoding strings should work', function(){

  it('for this simple sentence', function() {
    assert.equal(UTF8.getStringFromBytes([
      'H'.charCodeAt(0),
      'e'.charCodeAt(0)
    ]), 'He');
  });

  it('for this simple sentence', function() {
    assert.equal(UTF8.getStringFromBytes(
      UTF8.setBytesFromString('J\'avais gagné 15€ au tiercé !')),
      'J\'avais gagné 15€ au tiercé !'
    );
  });

  function compareFile(file, done) {
    if(global.XMLHttpRequest) {
      var oReq = new XMLHttpRequest();
      oReq.open('GET', '/base/tests/files/' + file, true);
      oReq.responseType = "arraybuffer";
      oReq.onload = function (oEvent) {
        var tReq = new XMLHttpRequest();
        tReq.open('GET', '/base/tests/files/' + file, true);
        tReq.onload = function (tEvent) {
          var a=new Uint8Array(oReq.response);
          assert.equal(
            UTF8.getStringFromBytes(a),
            tReq.responseText
          );
          done();
        };
        tReq.send(null);
      };
      oReq.send(null);
    } else {
      var fs = require('fs');
      fs.readFile(__dirname + '/files/' + file, function (err, data) {
        var a = new Uint8Array(data);
        assert.equal(
          UTF8.getStringFromBytes(a),
          data.toString('utf-8')
        );
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

describe('Encoding unencodable chars', function(){


  it('should raise an exception', function(done) {

    try {
      UTF8.getBytesForCharCode(0xFFFFFFFF);
    } catch(e) {
      done();
    }

  });

});

describe('Decoding bad strings should raise an exception', function(){

  it('with a bad first byte', function(done) {

    try {
      UTF8.getCharCode(new Uint8Array([0xF0, 0xFF]), 0, 2);
    } catch(e) {
      done();
    }

  });

  it('with a bad second byte', function(done) {

    try {
      UTF8.getCharCode(new Uint8Array([0xC3, 0xF9]), 0, 2);
    } catch(e) {
      done();
    }

  });

});

describe('Decoding unterminated strings', function(){


  it('should silently fail', function() {
    assert.equal(
      UTF8.getStringFromBytes(new Uint8Array([0xF4, 0x8F])),
      ''
    );
  });


  it('should raise an exception in strict mode', function(done) {
    try {
      UTF8.getStringFromBytes(new Uint8Array([0xF4, 0x8F]), null, null, true);
    } catch(e) {
      done();
    }
  });

});

describe('Encoding strings in a too small ArrayBuffer', function(){

  it('should silently fail', function() {
    var bytes=new Uint8Array(2);
    assert.equal(UTF8.getStringFromBytes(UTF8.setBytesFromString(
      '1.3$ ~= 1€', bytes)), '1.');
    assert.equal(UTF8.getStringFromBytes(UTF8.setBytesFromString(
      '€', bytes)), '');
    assert.equal(UTF8.getStringFromBytes(UTF8.setBytesFromString(
      '1é', bytes)), '1');
  });

  it('should fail when using strict mode', function() {
    try {
      var bytes=new Uint8Array(2);
      UTF8.setBytesFromString('1.3$ ~= 1€', bytes, null, null, true);
      throw 'Encoding a string in a too short ArrayBuffer in strict mode did' +
        ' not fail.';
    } catch (e) {
      if('Not enought bytes to encode the char "3" at the offset "2".'
        !== e.message) {
        throw e;
      }
    }
    try {
      var bytes=new Uint8Array(2);
      UTF8.setBytesFromString('€', bytes, null, null, true);
      throw 'Encoding a string in a too short ArrayBuffer in strict mode did' +
        ' not fail.';
    } catch (e) {
      if('Not enought bytes to encode the char "€" at the offset "0".' !==
        e.message) {
        throw e;
      }
    }
    try {
      var bytes=new Uint8Array(2);
      UTF8.setBytesFromString('1é',bytes,null,null,true);
      throw 'Encoding a string in a too short ArrayBuffer in strict mode did' +
        ' not fail.';
    } catch (e) {
      if('Not enought bytes to encode the char "é" at the offset "1".' !==
        e.message) {
        throw e;
      }
    }
  });

});

describe('Detecting the encoding', function(){

  it('should work with valid utf-8', function() {
    assert.equal(UTF8.isNotUTF8(UTF8.setBytesFromString('€')), false);
  });

  it('should fail with non UTF-8', function() {
    assert.equal(UTF8.isNotUTF8(new Uint8Array([0xC0, 0x90, 0x80, 0x01])), true);
  });

});

