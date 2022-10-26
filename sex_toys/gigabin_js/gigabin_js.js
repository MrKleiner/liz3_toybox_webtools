



class gigabin
{
	// constructor(height, width) {
	
	// either takes ArrayBuffer or nothing
	// nothing means create empty gigabin
	// todo: also accept blobs
	// isntanceof Blob
	constructor(src=null) {

		this.giga_identifier = 'gigachad';
		this.giga_len = this.giga_identifier.length

		this.str = function(inp){
			// return inp.toString()
			try {
				let shite = inp.toString();
				return shite
			} catch (error) {
				return '' + inp
			}
		}

		this.zfill = function(dt='null', amt=1, char='0') {
			var pad_char = typeof char !== 'undefined' ? char : '0';
			var pad = new Array(1 + amt).join(pad_char);
			return (pad + dt).slice(-pad.length);
		}

		this.header = null;
		this.bin = [];

		// this.gigastorage = {}
		// this.gigastorage.waiters = {}

		// if valid data was passed - evaluate it and check if it's valid
		const accepted = [
			src instanceof ArrayBuffer,
			src instanceof Uint8Array,
			src instanceof Uint16Array,
			src instanceof Uint32Array,
			src instanceof Uint8ClampedArray,
			src instanceof BigUint64Array,
			src instanceof Int8Array,
			src instanceof Int16Array,
			src instanceof Float32Array,
			src instanceof Float64Array,
			src instanceof BigInt64Array
		];

		if (accepted.includes(true)){
			const operate = new Uint8Array(src);
			// validate format
			// todo: wtf
			try {
				console.log(this.UTF8ArrToStr(operate.slice(0, this.giga_len)))
				if (this.UTF8ArrToStr(operate.slice(0, this.giga_len)) != this.giga_identifier){
					throw 'invalid header'
				}
			} catch (error) {
				console.error(error);
				throw 'Given data structure does not represent a valid gigabin format'
			}

			// get header size
			const head_size = parseInt(this.UTF8ArrToStr(operate.slice(this.giga_len, this.giga_len+32)).replaceAll('!', ''))

			// read header
			const json_piece = operate.slice(operate.length - head_size, operate.length);
			const head = JSON.parse(this.UTF8ArrToStr(this.base64DecToArr(this.UTF8ArrToStr(json_piece))));

			console.log('got gigabin header:', head)

			// store header
			this.header = head;

			// store bin
			// store this as an array, because it has to be manipulated
			this.bin = Array.from(operate.slice(this.giga_len+32, operate.length - head_size));

		}else{
			this.header = {
				'stores': {},
				'version': '0.17',
				'total_size': null,
				'comment': ''
			}

			this.bin = [];
		}
	};


	// read file by name
	// read_as:
	// buffer
	// text
	// json
	// blob
	// obj_url

	// will read into array of given types if file is an array of files
	// todo: write a generator of this
	read_file(name=null, read_as='buffer'){
		const fl_info = this.header['stores'][name]
		if (name == null || !fl_info){
			console.log('giga bin: File does not exist in the binary');
			return
		}


		//
		// Solid type file
		//
		if (fl_info['type'] == 'solid'){
			const chunk_info = this.header['stores'][name]['bits'];

			// if file exists, then read it
			const chunk = this.read_bit(chunk_info, read_as);

			return chunk
		}


		//
		// Array type file
		//
		if (fl_info['type'] == 'array'){
			var file_array = [];

			for (var ch of fl_info['bits']){
				file_array.push(this.read_bit(ch, read_as))
			}

			return file_array
		}


	};


	// reads a given bit
	// todo: error checks and margins
	read_bit(bit=null, btype='buffer'){
		if (!bit){return null}

		// (regular array)
		const chunk = this.bin.slice(bit[0], bit[0] + bit[1])

		if (btype == 'array'){
			return chunk
		}

		if (btype == 'buffer'){
			return new Uint8Array(chunk)
		}

		if (btype == 'text'){
			// todo: use try/catch
			return this.UTF8ArrToStr(chunk)
		}

		if (btype == 'json'){
			// todo: use try/catch
			return JSON.parse(this.UTF8ArrToStr(chunk))
		}

		if (btype == 'blob'){
			return new Blob([chunk], {type: 'text/plain'});
		}

		if (btype == 'obj_url'){
			return (window.URL || window.webkitURL).createObjectURL(new Blob([chunk], {type: 'text/plain'}));
		}

		return chunk
	}


	// pass true for it to return an array instead of dict
	list_files(ordered=false){
		
		const head = this.header['stores'];

		if (ordered == true){
			var fls = [];
			for (var fl in head){
				fls.push({
					'size': head[fl]['bits'][1],
					'type': head[fl]['type'],
					'name': fl
				})
			}
			return fls
		}

		var fls = {};
		for (var fl in head){
			fls[fl] = {
				'size': head[fl]['bits'][1],
				'type': head[fl]['type'],
				'name': fl
			}
		}
		return fls
	};


	// info should cointain:
	// name: filename
	// data: data to store / pass empty array to init a new array
	// overwrite: true/false
	add_file(info=null){
		if (!info){
			throw 'gigabin: Invalid file payload'
		}

		const store = this.header['stores'];

		// don't do shit if file exists, but overwrite is set to false
		if (store[info['name']] && info['overwrite'] != true){
			console.warn('gigabin: File exists in the file pool, but overwrite is set to false');
			return null
		}

		// else - overwrite
		this.delete_file(info['name'])

		// 
		// First, convert to an appropriate type
		//

		var bindata = info['data'];

		const type_buffer = [
			bindata instanceof ArrayBuffer,
			bindata instanceof Uint8Array,
			bindata instanceof Uint16Array,
			bindata instanceof Uint32Array,
			bindata instanceof Uint8ClampedArray,
			bindata instanceof BigUint64Array,
			bindata instanceof Int8Array,
			bindata instanceof Int16Array,
			bindata instanceof Float32Array,
			bindata instanceof Float64Array,
			bindata instanceof BigInt64Array
		];

		const type_string = [
			typeof bindata == 'string',
			typeof bindata == 'number',
			typeof bindata == 'boolean'
		];

		const type_json = [
			bindata instanceof Object,
			bindata instanceof Array
		];

		// check if any valid data is present
		if (!type_buffer.includes(true) && !type_string.includes(true) && !type_json.includes(true)){
			console.warn('gigabin: unsupported data type')
			return null
		}

		bindata = (
			// prioritise buffers
			(type_buffer.includes(true) ? (new Uint8Array(bindata)) : false)
			||
			// then strings and numbers
			(type_string.includes(true) ? (this.strToUTF8Arr(this.str(bindata))) : false)
			||
			// lastly, try to dump jsons
			(type_json.includes(true) ? (this.strToUTF8Arr(JSON.stringify(bindata))) : false)
		);

		this.header['stores'][info['name']] = {
			'type': 'solid',
			'bits': [this.bin.length, bindata.length, null]
		}

		this.bin = this.bin.concat(Array.from(bindata));
	};


	delete_file(name=null){
		if (!name || !this.header['stores'][name]){
			// console.log('gigabin: Tried to delete non-existent file')
			return null
		}

		delete this.header['stores'][name]

		var head = this.header['stores'];

		var new_buffer = [];

		// re-append everything except the requested name
		for (rewrite in head){
			var chunk_info = head[rewrite]['bits'];
			const new_chunk = this.bin.slice(this.bin.slice(chunk_info[0], chunk_info[0] + chunk_info[1]))
			head[rewrite]['bits'] = [new_buffer.length, new_chunk.length]
			new_buffer = new_buffer.concat(new_chunk)
		}

		// re-save bin
		this.bin = new_buffer;

		return true
	};


	// convert to a single file
	// how:
	// blob: return blob
	// buffer: return buffer
	save(how='buffer'){
		var giga_data = [];

		// write gigabin identifier
		giga_data = giga_data.concat(Array.from(this.strToUTF8Arr(this.giga_identifier)))

		// compile header
		// todo: finally fix atob and btoa
		const giga_head = this.base64EncArr(this.strToUTF8Arr(JSON.stringify(this.header)))

		// write padded header size
		giga_data = giga_data.concat(Array.from(this.strToUTF8Arr(this.zfill(giga_head.length.toString(), 32, '!'))))

		// write data
		giga_data = giga_data.concat(this.bin)

		// write header
		giga_data = giga_data.concat(Array.from(this.strToUTF8Arr(giga_head)))

		console.log('header', giga_head)

		// dev: return buffer
		return this.base64EncArr(new Uint16Array(giga_data))
	}






























	/*\
	|*|
	|*|  Base64 / binary data / UTF-8 strings utilities
	|*|
	|*|  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
	|*|
	\*/

	/* Array of bytes to Base64 string decoding */

	b64ToUint6 (nChr) {

	  return nChr > 64 && nChr < 91 ?
		  nChr - 65
		: nChr > 96 && nChr < 123 ?
		  nChr - 71
		: nChr > 47 && nChr < 58 ?
		  nChr + 4
		: nChr === 43 ?
		  62
		: nChr === 47 ?
		  63
		:
		  0;

	}

	base64DecToArr (sBase64, nBlocksSize) {

	  var
		sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
		nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

	  for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
		nMod4 = nInIdx & 3;
		nUint24 |= this.b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 6 * (3 - nMod4);
		if (nMod4 === 3 || nInLen - nInIdx === 1) {
		  for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
			taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
		  }
		  nUint24 = 0;

		}
	  }

	  return taBytes;
	}

	/* Base64 string to array encoding */

	uint6ToB64 (nUint6) {

	  return nUint6 < 26 ?
		  nUint6 + 65
		: nUint6 < 52 ?
		  nUint6 + 71
		: nUint6 < 62 ?
		  nUint6 - 4
		: nUint6 === 62 ?
		  43
		: nUint6 === 63 ?
		  47
		:
		  65;

	}

	base64EncArr (aBytes) {

	  var nMod3 = 2, sB64Enc = "";

	  for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
		nMod3 = nIdx % 3;
		// REVERT TO THIS IF NOW BROKEN
		// if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
		if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += ""; }
		nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
		if (nMod3 === 2 || aBytes.length - nIdx === 1) {
		  sB64Enc += String.fromCodePoint(this.uint6ToB64(nUint24 >>> 18 & 63), this.uint6ToB64(nUint24 >>> 12 & 63), this.uint6ToB64(nUint24 >>> 6 & 63), this.uint6ToB64(nUint24 & 63));
		  nUint24 = 0;
		}
	  }

	  return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');

	}

	/* UTF-8 array to JS string and vice versa */

	UTF8ArrToStr (aBytes) {

	  var sView = "";

	  for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
		nPart = aBytes[nIdx];
		sView += String.fromCodePoint(
		  nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
			/* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */
			(nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
		  : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
			(nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
		  : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
			(nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
		  : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
			(nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
		  : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
			(nPart - 192 << 6) + aBytes[++nIdx] - 128
		  : /* nPart < 127 ? */ /* one byte */
			nPart
		);
	  }

	  return sView;

	}

	strToUTF8Arr (sDOMStr) {

	  var aBytes, nChr, nStrLen = sDOMStr.length, nArrLen = 0;

	  /* mapping... */

	  for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
		nChr = sDOMStr.codePointAt(nMapIdx);

		if (nChr > 65536) {
		  nMapIdx++;
		}

		nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
	  }

	  aBytes = new Uint8Array(nArrLen);

	  /* transcription... */

	  for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
		nChr = sDOMStr.codePointAt(nChrIdx);
		if (nChr < 128) {
		  /* one byte */
		  aBytes[nIdx++] = nChr;
		} else if (nChr < 0x800) {
		  /* two bytes */
		  aBytes[nIdx++] = 192 + (nChr >>> 6);
		  aBytes[nIdx++] = 128 + (nChr & 63);
		} else if (nChr < 0x10000) {
		  /* three bytes */
		  aBytes[nIdx++] = 224 + (nChr >>> 12);
		  aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
		  aBytes[nIdx++] = 128 + (nChr & 63);
		} else if (nChr < 0x200000) {
		  /* four bytes */
		  aBytes[nIdx++] = 240 + (nChr >>> 18);
		  aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
		  aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
		  aBytes[nIdx++] = 128 + (nChr & 63);
		  nChrIdx++;
		} else if (nChr < 0x4000000) {
		  /* five bytes */
		  aBytes[nIdx++] = 248 + (nChr >>> 24);
		  aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
		  aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
		  aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
		  aBytes[nIdx++] = 128 + (nChr & 63);
		  nChrIdx++;
		} else /* if (nChr <= 0x7fffffff) */ {
		  /* six bytes */
		  aBytes[nIdx++] = 252 + (nChr >>> 30);
		  aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
		  aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
		  aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
		  aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
		  aBytes[nIdx++] = 128 + (nChr & 63);
		  nChrIdx++;
		}
	  }

	  return aBytes;

	}

	btoa(st=''){
		if (st==''){return ''}
		return base64EncArr(this.strToUTF8Arr(st))
	}

	atob(st=''){
		if (st==''){return ''}
		return UTF8ArrToStr(this.base64DecToArr(st))
	}


	// quick string encoding
	u8btoa(st) {
	    return btoa(unescape(encodeURIComponent(st)));
	}
	// decode
	u8atob(st) {
	    return decodeURIComponent(escape(atob(st)));
	}


}
window.gigabin = gigabin