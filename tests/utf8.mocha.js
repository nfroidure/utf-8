// AMD + Global: r.js compatible
// Use START + END markers to keep module content only
(function(root,define){ define(['src/UTF8'], function(UTF8) {
// START: Module logic start

	// Helpers
	var assert= {
		equal: function(a,b) {
			if(a!==b) {
				throw Error(JSON.stringify(a)+' differs from '+JSON.stringify(b));
			}
		}
	};

	// Tests : http://en.wikipedia.org/wiki/UTF-8
	describe('Decoding chars should work', function(){

		it('for 1 byte encoded chars in an array', function() {
			// [NUL]	U+0000	0		00000000	00
			assert.equal(UTF8.getCharCode([0x00]), 0x00);
			// [US]		U+001F	31	00011111	1F
			assert.equal(UTF8.getCharCode([0x1F]), 0x1F);
			// [SP]		U+0020	32	00100000	20
			assert.equal(UTF8.getCharCode([0x20]), 0x20);
			// A 			U+0041	65	01000001	41
			assert.equal(UTF8.getCharCode([0x41]), 0x41);
			// ~			U+007E	126	01111110	7E
			assert.equal(UTF8.getCharCode([0x7E]), 0x7E);
			// [DEL]	U+007F	127	01111111	7F
			assert.equal(UTF8.getCharCode([0x7F]), 0x7F);
		});

		it('for 1 byte encoded chars in a TypedArray', function() {
			// [NUL]	U+0000	0		00000000	00
			assert.equal(UTF8.getCharCode(new Uint8Array([0x00])), 0x00);
			// [US]		U+001F	31	00011111	1F
			assert.equal(UTF8.getCharCode(new Uint8Array([0x1F])), 0x1F);
			// [SP]		U+0020	32	00100000	20
			assert.equal(UTF8.getCharCode(new Uint8Array([0x20])), 0x20);
			// A 			U+0041	65	01000001	41
			assert.equal(UTF8.getCharCode(new Uint8Array([0x41])), 0x41);
			// ~			U+007E	126	01111110	7E
			assert.equal(UTF8.getCharCode(new Uint8Array([0x7E])), 0x7E);
			// [DEL]	U+007F	127	01111111	7F
			assert.equal(UTF8.getCharCode(new Uint8Array([0x7F])), 0x7F);
		});

		it('for 2 bytes encoded chars in an array', function() {
			// [PAD]	U+0080	128	(11000010 10000000)	(C2 80)
			assert.equal(UTF8.getCharCode([0xC2, 0x80]), 128);
			// [APC]	U+009F	159	(11000010 10011111)	(C2 9F)
			assert.equal(UTF8.getCharCode([0xC2, 0x9F]), 159);
			// [NBSP]	U+00A0	160	(11000010 10100000)	(C2 A0)
			assert.equal(UTF8.getCharCode([0xC2, 0xA0]), 160);
			// é			U+00E9	233	(11000011 10101001)	(C3 A9)
			assert.equal(UTF8.getCharCode([0xC3, 0xA9]), 233);
		});

		it('for 2 bytes encoded chars in a TypedArray', function() {
			// [PAD]	U+0080	128	(11000010 10000000)	(C2 80)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xC2, 0x80])), 128);
			// [APC]	U+009F	159	(11000010 10011111)	(C2 9F)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xC2, 0x9F])), 159);
			// [NBSP]	U+00A0	160	(11000010 10100000)	(C2 A0)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xC2, 0xA0])), 160);
			// é			U+00E9	233	(11000011 10101001)	(C3 A9)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xC3, 0xA9])), 233);
		});

		it('for 3 bytes encoded chars in an array', function() {
			// []	U+E000	57344	(11101110 10000000 10000000)	(EE 80 80)
			assert.equal(UTF8.getCharCode([0xEE, 0x80, 0x80]), 57344);
			// []	U+F8FF	63743	(11101111 10100011 10111111)	(EF A3 BF)
			assert.equal(UTF8.getCharCode([0xEF, 0xA3, 0xBF]), 63743);
			// 豈		U+F900	63744	(11101111 10100100 10000000)	(EF A4 80)
			assert.equal(UTF8.getCharCode([0xEF, 0xA4, 0x80]), 63744);
			// []		U+FDD0	64976	(11101111 10110111 10010000)	(EF B7 90)
			assert.equal(UTF8.getCharCode([0xEF, 0xB7, 0x90]), 64976);
			// []		U+FDEF	65007	(11101111 10110111 10101111)	(EF B7 AF)
			assert.equal(UTF8.getCharCode([0xEF, 0xB7, 0x90]), 64976);
			// �		U+FFFD	65533	(11101111 10111111 10111101)	(EF BF BD)
			assert.equal(UTF8.getCharCode([0xEF, 0xBF, 0xBD]), 65533);
			// []		U+FFFE	65534	(11101111 10111111 10111110)	(EF BF BE)
			assert.equal(UTF8.getCharCode([0xEF, 0xBF, 0xBE]), 65534);
			// []		U+FFFF	65535	(11101111 10111111 10111111)	(EF BF BF)
			assert.equal(UTF8.getCharCode([0xEF, 0xBF, 0xBF]), 65535);
		});

		it('for 3 bytes encoded chars in a TypedArray', function() {
			// []	U+E000	57344	(11101110 10000000 10000000)	(EE 80 80)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xEE, 0x80, 0x80])), 57344);
			// []	U+F8FF	63743	(11101111 10100011 10111111)	(EF A3 BF)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xA3, 0xBF])), 63743);
			// 豈		U+F900	63744	(11101111 10100100 10000000)	(EF A4 80)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xA4, 0x80])), 63744);
			// []		U+FDD0	64976	(11101111 10110111 10010000)	(EF B7 90)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xB7, 0x90])), 64976);
			// []		U+FDEF	65007	(11101111 10110111 10101111)	(EF B7 AF)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xB7, 0x90])), 64976);
			// �		U+FFFD	65533	(11101111 10111111 10111101)	(EF BF BD)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xBF, 0xBD])), 65533);
			// []		U+FFFE	65534	(11101111 10111111 10111110)	(EF BF BE)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xBF, 0xBE])), 65534);
			// []		U+FFFF	65535	(11101111 10111111 10111111)	(EF BF BF)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xEF, 0xBF, 0xBF])), 65535);
		});

		it('for 4 bytes encoded chars in an array', function() {
			// �		U+10000		65536		(11110000 10010000 10000000 10000000)	(F0 90 80 80)
			assert.equal(UTF8.getCharCode([0xF0, 0x90, 0x80, 0x80]), 65536);
			// []		U+10FFFF	1114111	(11110100 10001111 10111111 10111111)	(F4 8F BF BF)
			assert.equal(UTF8.getCharCode([0xF4, 0x8F, 0xBF, 0xBF]), 1114111);
		});

		it('for 4 bytes encoded chars in a TypedArray', function() {
			// �		U+10000		65536		(11110000 10010000 10000000 10000000)	(F0 90 80 80)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xF0, 0x90, 0x80, 0x80])), 65536);
			// []		U+10FFFF	1114111	(11110100 10001111 10111111 10111111)	(F4 8F BF BF)
			assert.equal(UTF8.getCharCode(new Uint8Array([0xF4, 0x8F, 0xBF, 0xBF])), 1114111);
		});

	});

	describe('Encoding chars should work', function(){

		it('for 1 byte encoded chars', function() {
			var bytes=UTF8.setBytesFromCharCode('1'.charCodeAt(0));
			assert.equal(bytes.length,1);
			assert.equal(bytes[0],49);
		});

		it('for 2 bytes encoded chars', function() {
			var bytes=UTF8.setBytesFromCharCode('é'.charCodeAt(0));
			assert.equal(bytes.length,2);
			assert.equal(bytes[0],0xC3);
			assert.equal(bytes[1],0xA9);
			var bytes=UTF8.setBytesFromCharCode('ä'.charCodeAt(0));
			assert.equal(bytes.length,2);
			assert.equal(bytes[0],0xC3);
			assert.equal(bytes[1],0xA4);
		});

		it('for 3 bytes encoded chars', function() {
			var bytes=UTF8.setBytesFromCharCode('€'.charCodeAt(0));
			assert.equal(bytes.length,3);
			assert.equal(bytes[0],0xE2);
			assert.equal(bytes[1],0x82);
			assert.equal(bytes[2],0xAC);
		});

	});

	describe('Encoding then decoding strings should work', function(){

		it('for this simple sentence', function() {
			assert.equal(UTF8.getStringFromBytes(UTF8.setBytesFromString(
				'J\'avais gagné 15€ au tiercé !')),'J\'avais gagné 15€ au tiercé !');
		});

		function compareFile(file, done) {
			var oReq = new XMLHttpRequest();
			oReq.open("GET", "/base/tests/files/"+file, true);
			oReq.responseType = "arraybuffer";
			oReq.onload = function (oEvent) {
				var tReq = new XMLHttpRequest();
				tReq.open("GET", "/base/tests/files/"+file, true);
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
		}

		it('for Debian russian man pages', function(done) {
			compareFile('man-chown-ru.txt', done);
		});

		it('for Debian japanese man pages', function(done) {
			compareFile('man-whatis-ja.txt', done);
		});

	});

// END: Module logic end

	return {};

});})(this,typeof define === 'function' && define.amd ? define : function (name, deps, factory) {
	var root=this;
	if(typeof name === 'object') {
		factory=deps; deps=name; name='_tests';
	}
	factory.apply(this, deps.map(function(dep){
		return root[dep.substring(dep.lastIndexOf('/')+1)];
	}));
}.bind(this));
