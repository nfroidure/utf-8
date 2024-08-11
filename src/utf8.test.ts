import { describe, test, expect } from '@jest/globals';
import * as UTF8 from './index.js';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { YError } from 'yerror';

// Tests : http://en.wikipedia.org/wiki/UTF-8
describe('Decoding chars should work', () => {
  test('for 1 byte encoded chars in an array', () => {
    // [NUL]  U+0000  0    00000000  00
    expect(UTF8.getCharCode([0x00])).toEqual(0x00);
    // [US]    U+001F  31  00011111  1F
    expect(UTF8.getCharCode([0x1f])).toEqual(0x1f);
    // [SP]    U+0020  32  00100000  20
    expect(UTF8.getCharCode([0x20])).toEqual(0x20);
    // A       U+0041  65  01000001  41
    expect(UTF8.getCharCode([0x41])).toEqual(0x41);
    // ~      U+007E  126  01111110  7E
    expect(UTF8.getCharCode([0x7e])).toEqual(0x7e);
    // [DEL]  U+007F  127  01111111  7F
    expect(UTF8.getCharCode([0x7f])).toEqual(0x7f);
  });

  test('for 1 byte encoded chars in a TypedArray', () => {
    // [NUL]  U+0000  0    00000000  00
    expect(UTF8.getCharCode(new Uint8Array([0x00]))).toEqual(0x00);
    // [US]    U+001F  31  00011111  1F
    expect(UTF8.getCharCode(new Uint8Array([0x1f]))).toEqual(0x1f);
    // [SP]    U+0020  32  00100000  20
    expect(UTF8.getCharCode(new Uint8Array([0x20]))).toEqual(0x20);
    // A       U+0041  65  01000001  41
    expect(UTF8.getCharCode(new Uint8Array([0x41]))).toEqual(0x41);
    // ~      U+007E  126  01111110  7E
    expect(UTF8.getCharCode(new Uint8Array([0x7e]))).toEqual(0x7e);
    // [DEL]  U+007F  127  01111111  7F
    expect(UTF8.getCharCode(new Uint8Array([0x7f]))).toEqual(0x7f);
  });

  test('for 2 bytes encoded chars in an array', () => {
    // [PAD]  U+0080  128  (11000010 10000000)  (C2 80)
    expect(UTF8.getCharCode([0xc2, 0x80])).toEqual(128);
    // [APC]  U+009F  159  (11000010 10011111)  (C2 9F)
    expect(UTF8.getCharCode([0xc2, 0x9f])).toEqual(159);
    // [NBSP]  U+00A0  160  (11000010 10100000)  (C2 A0)
    expect(UTF8.getCharCode([0xc2, 0xa0])).toEqual(160);
    // é      U+00E9  233  (11000011 10101001)  (C3 A9)
    expect(UTF8.getCharCode([0xc3, 0xa9])).toEqual(233);
  });

  test('for 2 bytes encoded chars in a TypedArray', () => {
    // [PAD]  U+0080  128  (11000010 10000000)  (C2 80)
    expect(UTF8.getCharCode(new Uint8Array([0xc2, 0x80]))).toEqual(128);
    // [APC]  U+009F  159  (11000010 10011111)  (C2 9F)
    expect(UTF8.getCharCode(new Uint8Array([0xc2, 0x9f]))).toEqual(159);
    // [NBSP]  U+00A0  160  (11000010 10100000)  (C2 A0)
    expect(UTF8.getCharCode(new Uint8Array([0xc2, 0xa0]))).toEqual(160);
    // é      U+00E9  233  (11000011 10101001)  (C3 A9)
    expect(UTF8.getCharCode(new Uint8Array([0xc3, 0xa9]))).toEqual(233);
  });

  test('for 3 bytes encoded chars in an array', () => {
    // []  U+E000  57344  (11101110 10000000 10000000)  (EE 80 80)
    expect(UTF8.getCharCode([0xee, 0x80, 0x80])).toEqual(57344);
    // []  U+F8FF  63743  (11101111 10100011 10111111)  (EF A3 BF)
    expect(UTF8.getCharCode([0xef, 0xa3, 0xbf])).toEqual(63743);
    // 豈    U+F900  63744  (11101111 10100100 10000000)  (EF A4 80)
    expect(UTF8.getCharCode([0xef, 0xa4, 0x80])).toEqual(63744);
    // []    U+FDD0  64976  (11101111 10110111 10010000)  (EF B7 90)
    expect(UTF8.getCharCode([0xef, 0xb7, 0x90])).toEqual(64976);
    // []    U+FDEF  65007  (11101111 10110111 10101111)  (EF B7 AF)
    expect(UTF8.getCharCode([0xef, 0xb7, 0x90])).toEqual(64976);
    // �    U+FFFD  65533  (11101111 10111111 10111101)  (EF BF BD)
    expect(UTF8.getCharCode([0xef, 0xbf, 0xbd])).toEqual(65533);
    // []    U+FFFE  65534  (11101111 10111111 10111110)  (EF BF BE)
    expect(UTF8.getCharCode([0xef, 0xbf, 0xbe])).toEqual(65534);
    // []    U+FFFF  65535  (11101111 10111111 10111111)  (EF BF BF)
    expect(UTF8.getCharCode([0xef, 0xbf, 0xbf])).toEqual(65535);
  });

  test('for 3 bytes encoded chars in a TypedArray', () => {
    // []  U+E000  57344  (11101110 10000000 10000000)  (EE 80 80)
    expect(UTF8.getCharCode(new Uint8Array([0xee, 0x80, 0x80]))).toEqual(57344);
    // []  U+F8FF  63743  (11101111 10100011 10111111)  (EF A3 BF)
    expect(UTF8.getCharCode(new Uint8Array([0xef, 0xa3, 0xbf]))).toEqual(63743);
    // 豈    U+F900  63744  (11101111 10100100 10000000)  (EF A4 80)
    expect(UTF8.getCharCode(new Uint8Array([0xef, 0xa4, 0x80]))).toEqual(63744);
    // []    U+FDD0  64976  (11101111 10110111 10010000)  (EF B7 90)
    expect(UTF8.getCharCode(new Uint8Array([0xef, 0xb7, 0x90]))).toEqual(64976);
    // []    U+FDEF  65007  (11101111 10110111 10101111)  (EF B7 AF)
    expect(UTF8.getCharCode(new Uint8Array([0xef, 0xb7, 0x90]))).toEqual(64976);
    // �    U+FFFD  65533  (11101111 10111111 10111101)  (EF BF BD)
    expect(UTF8.getCharCode(new Uint8Array([0xef, 0xbf, 0xbd]))).toEqual(65533);
    // []    U+FFFE  65534  (11101111 10111111 10111110)  (EF BF BE)
    expect(UTF8.getCharCode(new Uint8Array([0xef, 0xbf, 0xbe]))).toEqual(65534);
    // []    U+FFFF  65535  (11101111 10111111 10111111)  (EF BF BF)
    expect(UTF8.getCharCode(new Uint8Array([0xef, 0xbf, 0xbf]))).toEqual(65535);
  });

  test('for 4 bytes encoded chars in an array', () => {
    // �    U+10000    65536    (11110000 10010000 10000000 10000000)  (F0 90 80 80)
    expect(UTF8.getCharCode([0xf0, 0x90, 0x80, 0x80])).toEqual(65536);
    // []    U+10FFFF  1114111  (11110100 10001111 10111111 10111111)  (F4 8F BF BF)
    expect(UTF8.getCharCode([0xf4, 0x8f, 0xbf, 0xbf])).toEqual(1114111);
    // []    U+1D306  119558  (11110000 10011101 10001100 10000110)  (F0 9D 8C 86)
    expect(UTF8.getCharCode([0xf0, 0x9d, 0x8c, 0x86])).toEqual(119558);
  });

  test('for 4 bytes encoded chars in a TypedArray', () => {
    // �    U+10000    65536    (11110000 10010000 10000000 10000000)  (F0 90 80 80)
    expect(UTF8.getCharCode(new Uint8Array([0xf0, 0x90, 0x80, 0x80]))).toEqual(
      65536,
    );
    // []    U+10FFFF  1114111  (11110100 10001111 10111111 10111111)  (F4 8F BF BF)
    expect(UTF8.getCharCode(new Uint8Array([0xf4, 0x8f, 0xbf, 0xbf]))).toEqual(
      1114111,
    );
    // []    U+1D306  119558  (11110000 10011101 10001100 10000110)  (F0 9D 8C 86)
    expect(UTF8.getCharCode(new Uint8Array([0xf0, 0x9d, 0x8c, 0x86]))).toEqual(
      119558,
    );
  });
});

describe('Computing needed bytes should work', () => {
  function createCodepoint(numBits) {
    let bits = '';

    while (numBits) {
      bits += '1';
      numBits--;
    }
    return parseInt(bits, 2);
  }

  describe('for 1 byte codepoints', () => {
    [1, 2, 3, 4, 5, 6, 7].forEach(function (n) {
      test('with ' + n + ' bit codepoints', () => {
        expect(UTF8.getBytesForCharCode(createCodepoint(n))).toEqual(1);
      });
    });
  });

  describe('for 2 bytes codepoints', () => {
    [8, 9, 10, 11].forEach(function (n) {
      test('with ' + n + ' bit codepoints', () => {
        expect(UTF8.getBytesForCharCode(createCodepoint(n))).toEqual(2);
      });
    });
  });

  describe('for 3 bytes codepoints', () => {
    [12, 13, 14, 15, 16].forEach(function (n) {
      test('with ' + n + ' bit codepoints', () => {
        expect(UTF8.getBytesForCharCode(createCodepoint(n))).toEqual(3);
      });
    });
  });

  describe('for 4 bytes codepoints', () => {
    [17, 18, 19, 20, 21].forEach(function (n) {
      test('with ' + n + ' bit codepoints', () => {
        expect(UTF8.getBytesForCharCode(createCodepoint(n))).toEqual(4);
      });
    });
  });
});

describe('Encoding chars should work', () => {
  test('for 1 byte encoded chars', () => {
    const bytes = UTF8.setBytesFromCharCode('1'.charCodeAt(0));

    expect(bytes.length).toEqual(1);
    expect(bytes[0]).toEqual(49);
  });

  test('for 2 bytes encoded chars', () => {
    let bytes = UTF8.setBytesFromCharCode('é'.charCodeAt(0));

    expect(bytes.length).toEqual(2);
    expect(bytes[0]).toEqual(0xc3);
    expect(bytes[1]).toEqual(0xa9);

    bytes = UTF8.setBytesFromCharCode('ä'.charCodeAt(0));
    expect(bytes.length).toEqual(2);
    expect(bytes[0]).toEqual(0xc3);
    expect(bytes[1]).toEqual(0xa4);
  });

  test('for 3 bytes encoded chars', () => {
    const bytes = UTF8.setBytesFromCharCode('€'.charCodeAt(0));

    expect(bytes.length).toEqual(3);
    expect(bytes[0]).toEqual(0xe2);
    expect(bytes[1]).toEqual(0x82);
    expect(bytes[2]).toEqual(0xac);
  });

  test('for 4 bytes encoded chars', () => {
    const bytes = UTF8.setBytesFromCharCode(119558);

    expect(bytes.length).toEqual(4);
    expect(bytes[0]).toEqual(0xf0);
    expect(bytes[1]).toEqual(0x9d);
    expect(bytes[2]).toEqual(0x8c);
    expect(bytes[3]).toEqual(0x86);
  });
});

describe('Encoding then decoding strings should work', () => {
  test('for this simple sentence', () => {
    expect(
      UTF8.getStringFromBytes(['H'.charCodeAt(0), 'e'.charCodeAt(0)]),
    ).toEqual('He');
  });

  test('for this simple sentence', () => {
    expect(
      UTF8.getStringFromBytes(
        UTF8.setBytesFromString("J'avais gagné 15€ au tiercé !"),
      ),
    ).toEqual("J'avais gagné 15€ au tiercé !");
  });

  test('for Debian russian man pages', async () => {
    const buffer = await readFile(join('fixtures', 'man-chown-ru.txt'));
    const data = new Uint8Array(buffer);

    expect(UTF8.getStringFromBytes(data)).toEqual(buffer.toString('utf-8'));
  });

  test('for Debian japanese man pages', async () => {
    const buffer = await readFile(join('fixtures', 'man-whatis-ja.txt'));
    const data = new Uint8Array(buffer);

    expect(UTF8.getStringFromBytes(data)).toEqual(buffer.toString('utf8'));
  });
});

describe('Encoding unencodable chars', () => {
  test('should raise an exception', async () => {
    try {
      UTF8.getBytesForCharCode(0xffffffff);
      throw new YError('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect((err as YError).code).not.toEqual('E_UNEXPECTED_SUCCESS');
    }
  });
});

describe('Decoding bad strings should raise an exception', () => {
  test('with a bad first byte', async () => {
    try {
      UTF8.getCharCode(new Uint8Array([0xf0, 0xff]), 0, 2);
      throw new YError('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect((err as YError).code).not.toEqual('E_UNEXPECTED_SUCCESS');
    }
  });

  test('with a bad second byte', () => {
    try {
      UTF8.getCharCode(new Uint8Array([0xc3, 0xf9]), 0, 2);
      throw new YError('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect((err as YError).code).not.toEqual('E_UNEXPECTED_SUCCESS');
    }
  });
});

describe('Decoding unterminated strings', () => {
  test('should silently fail', () => {
    expect(UTF8.getStringFromBytes(new Uint8Array([0xf4, 0x8f]))).toEqual('');
  });

  test('should raise an exception in strict mode', async () => {
    try {
      UTF8.getStringFromBytes(
        new Uint8Array([0xf4, 0x8f]),
        undefined,
        undefined,
        true,
      );
      throw new YError('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect((err as YError).code).not.toEqual('E_UNEXPECTED_SUCCESS');
    }
  });
});

describe('Encoding strings in a too small ArrayBuffer', () => {
  test('should silently fail', () => {
    const bytes = new Uint8Array(2);

    expect(
      UTF8.getStringFromBytes(UTF8.setBytesFromString('1.3$ ~= 1€', bytes)),
    ).toEqual('1.');
    expect(
      UTF8.getStringFromBytes(UTF8.setBytesFromString('€', bytes)),
    ).toEqual('');
    expect(
      UTF8.getStringFromBytes(UTF8.setBytesFromString('1é', bytes)),
    ).toEqual('1');
  });

  test('should fail when using strict mode', () => {
    try {
      const bytes = new Uint8Array(2);

      UTF8.setBytesFromString('1.3$ ~= 1€', bytes, undefined, undefined, true);
      throw new YError('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect((err as YError).code).toEqual('E_BUFFER_OVERFLOW');
      expect((err as YError).params).toEqual(['3', 2]);
    }
    try {
      const bytes = new Uint8Array(2);

      UTF8.setBytesFromString('€', bytes, undefined, undefined, true);

      throw new YError('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect((err as YError).code).toEqual('E_BUFFER_OVERFLOW');
      expect((err as YError).params).toEqual(['€', 0]);
    }
    try {
      const bytes = new Uint8Array(2);

      UTF8.setBytesFromString('1é', bytes, undefined, undefined, true);

      throw new YError('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect((err as YError).code).toEqual('E_BUFFER_OVERFLOW');
      expect((err as YError).params).toEqual(['é', 1]);
    }
  });
});

describe('Detecting the encoding', () => {
  test('should work with valid utf-8', () => {
    expect(UTF8.isNotUTF8(UTF8.setBytesFromString('€'))).toEqual(false);
  });

  test('should fail with non UTF-8', () => {
    expect(UTF8.isNotUTF8(new Uint8Array([0xc0, 0x90, 0x80, 0x01]))).toEqual(
      true,
    );
  });
});
