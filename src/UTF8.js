// UTF8 : Manage UTF-8 strings in ArrayBuffers

// AMD + global + NodeJS : You can use this object by inserting a script
// or using an AMD loader (like RequireJS) or using NodeJS
(function(root,define){ define([], function() {
// START: Module logic start

	var UTF8={
		// UTF8 encoding detection
		'isUTF8': function(string) {
			try {
				UTF8.setBytesFromString(string);
			} catch(e) {
				return false;
			}
			return true;
		},
		// UTF8 decoding functions
		'getCharLength': function(theByte) {
			// 4 bytes encoded char (mask 11110000)
			if(0xF0==(theByte&0xF0)) {
				return 4;
			// 3 bytes encoded char (mask 11100000)
			} else if(0xE0==(theByte&0xE0)) {
				return 3;
			// 2 bytes encoded char (mask 11000000)
			} else if(0xC0==(theByte&0xC0)) {
				return 2;
			// 1 bytes encoded char
			} else if(theByte==(theByte&0x7F)) {
				return 1;
			}
			return 0;
		},
		'getCharCode': function(bytes, byteOffset, charLength) {
			var charCode=0, mask='';
			byteOffset=byteOffset||0;
			// Retrieve charLength if not given
			charLength=charLength||UTF8.getCharLength(bytes[byteOffset]);
			if(charLength==0) {
				throw new Error(bytes[byteOffset].toString(2)+' is not a significative'
					+' byte (offset:'+byteOffset+').');
			}
			// Return byte value if charlength is 1
			if(1===charLength) {
				return bytes[byteOffset];
			}
			// Test UTF8 integrity
			mask='00000000';
			mask[charLength]=1
			if(bytes[byteOffset]&(parseInt(mask,2))) {
				throw Error('Index '+byteOffset+': A '+charLength+' bytes encoded char'
					+' cannot encode the '+charLength+'th rank bit to 1.');
			}
			// Reading the first byte
			mask='0000'.slice(0,charLength+1)+'11111111'.slice(charLength+1);
			charCode+=(bytes[byteOffset]&parseInt(mask,2))<<((--charLength)*6);
			// Reading the next bytes
			while(charLength) {
				if(0x80!==bytes[byteOffset+1]&0x80
					||0x40===bytes[byteOffset+1]&0x40) {
					throw Error('Index '+(byteOffset+1)+': Next bytes of encoded char'
						+' must begin with a "10" bit sequence.');
				}
				charCode+=((bytes[++byteOffset]&0x3F)<<((--charLength)*6));
			}
			return charCode;
		},
		'getStringFromBytes': function(bytes, byteOffset, byteLength, strict) {
			var charLength, chars=[];
			byteOffset=byteOffset|0;
			byteLength=('number' === typeof byteLength?byteLength:
				bytes.byteLength||bytes.length);
			for(; byteOffset<byteLength; byteOffset++) {
				charLength=UTF8.getCharLength(bytes[byteOffset]);
				if(byteOffset+charLength>byteLength) {
					if(strict) {
						throw Error('Index '+byteOffset+': Found a '+charLength+' bytes'
							+' encoded char declaration but only '+(byteLength-byteOffset)
							+' bytes are available.');
					}
				} else {
					chars.push(String.fromCharCode(
						UTF8.getCharCode(bytes, byteOffset, charLength, strict)
					));
				}
				byteOffset+=charLength-1;
			}
			return chars.join('');
		},
		// UTF8 encoding functions
		'getBytesForCharCode':function(charCode) {
			for(var i=0; i<4; i++) {
				if(charCode<Math.pow(2,7+(i*6))) {
					return i+1;
				}
			}
			throw new Error('CharCode '+charCode+' cannot be encoded with UTF8.');
		},
		'setBytesFromCharCode':function(charCode, bytes, byteOffset, neededBytes) {
			charCode=charCode|0;
			bytes=bytes||[];
			byteOffset=byteOffset|0;
			neededBytes=neededBytes||UTF8.getBytesForCharCode(charCode);
			// Setting the charCode as it to bytes if the byte length is 1
			if(1==neededBytes) {
				bytes[byteOffset]=charCode;
			} else {
				// Computing the first byte
				bytes[byteOffset++]=(parseInt('1111'.slice(0,neededBytes),2)<<8-neededBytes)
					+(charCode>>>((--neededBytes)*6));
				// Computing next bytes
				for(;neededBytes>0;) {
					bytes[byteOffset++]=((charCode>>>((--neededBytes)*6))&0x3F)|0x80;
				}
			}
			return bytes;
		},
		'setBytesFromString': function(string, bytes, byteOffset, byteLength) {
			string=string||'';
			bytes=bytes||[];
			byteOffset=byteOffset|0;
			byteLength=('number' === typeof byteLength?byteLength:
				bytes.byteLength||Infinity);
			for(var i=0, j=string.length; i<j; i++) {
				var neededBytes=UTF8.getBytesForCharCode(string[i].charCodeAt(0));
				UTF8.setBytesFromCharCode(string[i].charCodeAt(0),
					bytes, byteOffset, neededBytes);
				byteOffset+=neededBytes;
			}
			return bytes;
		}
	};

// END: Module logic end

	return UTF8;

});})(this,typeof define === 'function' && define.amd ?
	// AMD
	define :
	// NodeJS
	(typeof exports === 'object'?function (name, deps, factory) {
		var root=this;
		if(typeof name === 'object') {
			factory=deps; deps=name;
		}
		module.exports=factory.apply(this, deps.map(function(dep) {
			return require(dep);
		}));
	}:
	// Global
	function (name, deps, factory) {
		var root=this;
		if(typeof name === 'object') {
			factory=deps; deps=name;
		}
		this.UTF8=factory.apply(this, deps.map(function(dep) {
			return root[dep.substring(dep.lastIndexOf('/')+1)];
		}));
	}.bind(this)
	)
);
