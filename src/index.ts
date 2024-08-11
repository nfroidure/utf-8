import { YError } from 'yerror';

// non UTF8 encoding detection (cf README file for details)
export function isNotUTF8(
  bytes: number[] | Uint8Array = [],
  byteOffset?: number,
  byteLength?: number,
) {
  try {
    getStringFromBytes(bytes, byteOffset, byteLength, true);
  } catch (_) {
    return true;
  }
  return false;
}

export function getCharLength(theByte: number) {
  // 4 bytes encoded char (mask 11110000)
  if (0xf0 == (theByte & 0xf0)) {
    return 4;
    // 3 bytes encoded char (mask 11100000)
  } else if (0xe0 == (theByte & 0xe0)) {
    return 3;
    // 2 bytes encoded char (mask 11000000)
  } else if (0xc0 == (theByte & 0xc0)) {
    return 2;
    // 1 bytes encoded char
  } else if (theByte == (theByte & 0x7f)) {
    return 1;
  }
  return 0;
}

// UTF8 decoding functions
export function getCharCode(
  bytes: number[] | Uint8Array = [],
  byteOffset: number = 0,
  charLength?: number,
) {
  let charCode = 0,
    mask = '';

  // validate that the array has at least one byte in it
  if (bytes.length - byteOffset <= 0) {
    throw new Error('No more characters remaining in array.');
  }
  // Retrieve charLength if not given
  charLength = charLength || getCharLength(bytes[byteOffset]);
  if (charLength == 0) {
    throw new Error(
      bytes[byteOffset].toString(2) +
        ' is not a significative' +
        ' byte (offset:' +
        byteOffset +
        ').',
    );
  }
  // Return byte value if charlength is 1
  if (1 === charLength) {
    return bytes[byteOffset];
  }
  // validate that the array has enough bytes to make up this character
  if (bytes.length - byteOffset < charLength) {
    throw new Error(
      'Expected at least ' + charLength + ' bytes remaining in array.',
    );
  }
  // Test UTF8 integrity
  mask = '00000000'.slice(0, charLength) + 1 + '00000000'.slice(charLength + 1);
  if (bytes[byteOffset] & parseInt(mask, 2)) {
    throw Error(
      'Index ' +
        byteOffset +
        ': A ' +
        charLength +
        ' bytes' +
        ' encoded char' +
        ' cannot encode the ' +
        (charLength + 1) +
        'th rank bit to 1.',
    );
  }
  // Reading the first byte
  mask = '0000'.slice(0, charLength + 1) + '11111111'.slice(charLength + 1);
  charCode += (bytes[byteOffset] & parseInt(mask, 2)) << (--charLength * 6);
  // Reading the next bytes
  while (charLength) {
    if (
      0x80 !== (bytes[byteOffset + 1] & 0x80) ||
      0x40 === (bytes[byteOffset + 1] & 0x40)
    ) {
      throw Error(
        'Index ' +
          (byteOffset + 1) +
          ': Next bytes of encoded char' +
          ' must begin with a "10" bit sequence.',
      );
    }
    charCode += (bytes[++byteOffset] & 0x3f) << (--charLength * 6);
  }
  return charCode;
}

export function getStringFromBytes(
  bytes: number[] | Uint8Array = [],
  byteOffset: number = 0,
  byteLength?: number,
  strict: boolean = false,
) {
  let charLength: number;
  const chars: string[] = [];

  if ('number' !== typeof byteLength) {
    byteLength = 'byteLength' in bytes ? bytes.byteLength : bytes.length;
  }

  for (; byteOffset < byteLength; byteOffset++) {
    charLength = getCharLength(bytes[byteOffset]);
    if (byteOffset + charLength > byteLength) {
      if (strict) {
        throw Error(
          'Index ' +
            byteOffset +
            ': Found a ' +
            charLength +
            ' bytes encoded char declaration but only ' +
            (byteLength - byteOffset) +
            ' bytes are available.',
        );
      }
    } else {
      chars.push(
        String.fromCodePoint(getCharCode(bytes, byteOffset, charLength)),
      );
    }
    byteOffset += charLength - 1;
  }
  return chars.join('');
}

// UTF8 encoding functions
export function getBytesForCharCode(charCode: number): number {
  if (charCode < 128) {
    return 1;
  } else if (charCode < 2048) {
    return 2;
  } else if (charCode < 65536) {
    return 3;
  } else if (charCode < 2097152) {
    return 4;
  }
  throw new Error('CharCode ' + charCode + ' cannot be encoded with UTF8.');
}

export function setBytesFromCharCode(
  charCode: number,
  bytes: number[] | Uint8Array = [],
  byteOffset: number = 0,
  neededBytes?: number,
) {
  charCode = charCode | 0;
  bytes = bytes || [];
  byteOffset = byteOffset | 0;
  neededBytes = neededBytes || getBytesForCharCode(charCode);
  // Setting the charCode as it to bytes if the byte length is 1
  if (1 == neededBytes) {
    bytes[byteOffset] = charCode;
  } else {
    // Computing the first byte
    bytes[byteOffset++] =
      (parseInt('1111'.slice(0, neededBytes), 2) << (8 - neededBytes)) +
      (charCode >>> (--neededBytes * 6));
    // Computing next bytes
    for (; neededBytes > 0; ) {
      bytes[byteOffset++] = ((charCode >>> (--neededBytes * 6)) & 0x3f) | 0x80;
    }
  }
  return bytes;
}

export function setBytesFromString(
  string: string = '',
  bytes: number[] | Uint8Array = [],
  byteOffset: number = 0,
  byteLength?: number,
  strict: boolean = false,
) {
  string = string || '';
  bytes = bytes || [];
  byteOffset = byteOffset | 0;

  if ('number' !== typeof byteLength) {
    byteLength = 'byteLength' in bytes ? bytes.byteLength : bytes.length;
  }

  for (let i = 0, j = string.length; i < j; i++) {
    const neededBytes = getBytesForCharCode(string[i].codePointAt(0) as number);

    if (strict && byteOffset + neededBytes > byteLength) {
      throw new YError(
        'E_BUFFER_OVERFLOW',
        string[i],
        byteOffset,
      );
    }
    setBytesFromCharCode(
      string[i].codePointAt(0) as number,
      bytes,
      byteOffset,
      neededBytes,
    );
    byteOffset += neededBytes;
  }
  return bytes;
}
