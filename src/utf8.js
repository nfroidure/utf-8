// UTF8 : Manage UTF-8 strings in ArrayBuffers

// AMD + global + NodeJS : You can use this object by inserting a script
// or using an AMD loader (like RequireJS) or using NodeJS
(function(root,define){ define([], function() {
// START: Module logic start

	var UTF8={
		'getStringFromBuffer': function(buffer, offset, byteLength, strict) {
			var bytes=new Uint8Array(buffer), chars=[];
			if(!(buffer instanceof ArrayBuffer)) {
				throw Error('Invalid buffer given.');
			}
			for(var i=offset||0, j=byteLength||buffer.byteLength; i<j; i++) {
				// 4 bytes encoded char
				if(0xF0==(bytes[i]&0xF0)) {
					if(i+3>j) {
						if(strict) {
							throw Error('Index:'+i+': Found a 4 bytes encoded char'
								+' declaration but only '+(j-i)+' bytes are available.');
						}
						break;
					}
					if(bytes[i]&0x8) {
						throw Error('Index:'+i+': A 4 bytes encoded char cannot encode the'
							+' 4th rank bit to 1.');
					}
					chars.push(String.fromCharCode(
						((bytes[i]&0x0F)<<18)
						+((bytes[++i]&0x3F)<<12)
						+((bytes[++i]&0x3F)<<6)
						+(bytes[++i]&0x3F)
					));
				// 3 bytes encoded char
				} else if(0xE0==(bytes[i]&0xE0)) {
					if(i+2>j) {
						if(strict) {
							throw Error('Index:'+i+': Found a 3 bytes encoded char'
								+' declaration but only '+(j-i)+' bytes are available.');
						}
						break;
					}
					if(bytes[i]&0x10) {
						throw Error('Index:'+i+': A 3 bytes encoded char cannot encode the'
							+' 5th rank bit to 1.');
					}
					chars.push(String.fromCharCode(
						((bytes[i]&0x1F)<<12)
						+((bytes[++i]&0x3F)<<6)
						+(bytes[++i]&0x3F)
					));
				// 2 bytes encoded char
				} else if(0xC0==(bytes[i]&0xC0)) {
					if(i+1>j) {
						if(strict) {
							throw Error('Index:'+i+': Found a 2 bytes encoded char'
								+' declaration but only 1 byte is available.');
						}
						break;
					}
					if(bytes[i]&0x20) {
						throw Error('Index:'+i+': A 2 bytes encoded char cannot encode the'
							+' 6th rank bit to 1.');
					}
					chars.push(String.fromCharCode(
						((bytes[i]&0x1F)<<6)
						+(bytes[++i]&0x3F))
					);
				// 1 bytes encoded char
				} else {
					chars.push(String.fromCharCode(bytes[i]));
				}
			}
			return chars.join('');
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
