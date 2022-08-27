



class iguana
{
	// constructor(height, width) {
	constructor() {


		//
		//	Python things
		//


		// capitalize string
		String.prototype.capitalize = function() {
			return this.charAt(0).toUpperCase() + this.slice(1);
		}
		String.prototype.lower = function() {
			return this.toLowerCase()
		}
		String.prototype.upper = function() {
			return this.toUpperCase()
		}

		String.prototype.zfill = function(amt=1, char='0') {
			var pad_char = typeof char !== 'undefined' ? char : '0';
			var pad = new Array(1 + amt).join(pad_char);
			return (pad + this).slice(-pad.length);
		}

		Number.prototype.zfill = function(amt=1, char='0') {
			var pad_char = typeof char !== 'undefined' ? char : '0';
			var pad = new Array(1 + amt).join(pad_char);
			return (pad + this).slice(-pad.length);
		}


		// python things

		function str(inp){
			// return inp.toString()
			try {
				let shite = inp.toString();
				return shite
			} catch (error) {
				return '' + inp
			}
		}
		window.str = str

		function int(inp){
			return parseInt(inp)
		}
		window.int = int

		function float(inp){
			return parseFloat(inp)
		}
		window.float = float

		// python-like range()
		function* range(start=0, stop=null, step=1)
		{
			if (stop == null){
				stop = start
				start = 0
			}
			try {
				start = parseInt(start)
				stop = parseInt(stop)
				step = parseInt(step)
			} catch (error) {
				return []
			}
			
			// var tgt_result = []
			// var eligible = true
			while (true) {
				if (start >= stop){
					return
					break
				}
				// tgt_result.push(start)
				yield start
				start += step
			}
		}
		window.range = range

	};

	get info() {
		return `Lizard's toybox. Version 0.37`
	};


	/*
	get help() {
		return {
			'info': `Lizard's toybox. Version 0.32`,

			'json_searcher': {
				'description': `A set of useful functions to search thorugh json objects and find k:v pairs`,
				'find_objects': `
					//example of grabbing objects that match some key and value in JSON
					console.log(find_objects(js,'ID','SGML'));
					//returns 1 object where a key names ID has the value SGML

					//example of grabbing objects that match some key in JSON
					console.log(find_objects(js,'ID',''));
					//returns 2 objects since keys with name ID are found in 2 objects

					//example of grabbing obejcts that match some value in JSON
					console.log(find_objects(js,'','SGML'));
					//returns 2 object since 2 obects have keys with the value SGML

					//example of grabbing objects that match some key in JSON
					console.log(find_objects(js,'ID',''));
					//returns 2 objects since keys with name ID are found in 2 objects
				`,
				'find_values': `
					//example of grabbing values from any key passed in JSON
					console.log(find_values(js,'ID'));
					//returns array ["SGML", "44"]
				`,
				'find_keys': `
					//example of grabbing keys by searching via values in JSON
					console.log(find_keys(js,'SGML'));
					//returns array ["ID", "SortAs", "Acronym", "str"] 
				`
			},

			'Random String Generator (rndwave)': {
				'description': 'Generate a random string of specified length.',
				'len': `The length of the resulting string, can be 0. (default to 8)`,
				'method': {
					'def': `Default charset: A-Z,-,_ + additional characters, if any`,
					'num': `A number + additional characters, if any`,
					'flac': `Same as def, but with additional symbols`
				}
			},

			'copytext': {
				'description': 'Pass a string to copy it to buffer.'
			},

			'rgb2hex': {
				'description': 'Convert RGB (128, 66, 111) to hex (#995757)'
			},

			'textdl': {
				'description': 'Download a file of specified filename and text content',
			}
		}
	}
	*/























	// ============================================================
	// ============================================================
	// 							JSON Lookup
	// ============================================================
	// ============================================================

	// goes through the entirety of a json object and returns whatever it found

	// sadly, recursive




	/*
	var json = '{"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","ID":"44","str":"SGML","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}';

	var js = JSON.parse(json);

	//example of grabbing objects that match some key and value in JSON
	console.log(find_objects(js,'ID','SGML'));
	//returns 1 object where a key names ID has the value SGML

	//example of grabbing objects that match some key in JSON
	console.log(find_objects(js,'ID',''));
	//returns 2 objects since keys with name ID are found in 2 objects

	//example of grabbing obejcts that match some value in JSON
	console.log(find_objects(js,'','SGML'));
	//returns 2 object since 2 obects have keys with the value SGML

	//example of grabbing objects that match some key in JSON
	console.log(find_objects(js,'ID',''));
	//returns 2 objects since keys with name ID are found in 2 objects

	//example of grabbing values from any key passed in JSON
	console.log(find_values(js,'ID'));
	//returns array ["SGML", "44"] 

	//example of grabbing keys by searching via values in JSON
	console.log(find_keys(js,'SGML'));
	//returns array ["ID", "SortAs", "Acronym", "str"] 

	*/

	// From github. Json/object searcher
	find_objects(obj, key, val) {
		  var objects = [];
		  for (var i in obj) {
			  if (!obj.hasOwnProperty(i)) continue;
			  if (typeof obj[i] == 'object') {
				  objects = objects.concat(this.find_objects(obj[i], key, val));    
			  } else 
			  //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
			  if (i == key && obj[i] == val || i == key && val == '') { //
				  objects.push(obj);
			  } else if (obj[i] == val && key == ''){
				  //only add if the object is not already in the array
				  if (objects.lastIndexOf(obj) == -1){
					  objects.push(obj);
				  }
			  }
		  }
		  return objects;
	  }


	  // return an array of values that match on a certain key
	  find_values(obj, key) {
		  var objects = [];
		  for (var i in obj) {
			  if (!obj.hasOwnProperty(i)) continue;
			  if (typeof obj[i] == 'object') {
				  objects = objects.concat(this.find_values(obj[i], key));
			  } else if (i == key) {
				  objects.push(obj[i]);
			  }
		  }
		  return objects;
	  }


	  // return an array of keys that match on a certain value
	  find_keys(obj, val) {
		  var objects = [];
		  for (var i in obj) {
			  if (!obj.hasOwnProperty(i)) continue;
			  if (typeof obj[i] == 'object') {
				  objects = objects.concat(this.find_keys(obj[i], val));
			  } else if (obj[i] == val) {
				  objects.push(i);
			  }
		  }
		  return objects;
	  }
























	// ============================================================
	// ============================================================
	// 						random shit generator
	// ============================================================
	// ============================================================

	// it's actually extremely fucking bad from technical point of view
	// but it's fast enough to generate very long strings
	// and then generate hash our of them

	// proper random shit
	// methods: 
	// "flac" - adv
	// "num" - number
	// [default] - simple
	// def - default
	// '' - default
	// todo: Current implementation is irrational.
	// Possible way of making it better:
	/*
		specify every parameter as a key=value pair.
		have defaults for them.
		if overwritten - use what is being told to.
		have many true/false statements.
		half-obligatory rnd method selection: Default+addon, Adv+addon, Numeric, rnd number from range, custom dict.
		if string then: Numbers TRUE/FALSE
		if numeric - Zero in the beginning? TRUE/FALSE
	*/


	rndwave(len=8, method='def', addchars='') {
		var result = '';

		var addon_chars = addchars.toString().replaceAll(' ', '');
		
		switch (method) {
			case 'flac':
				var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-()=+*#/!&?<>$~' + addon_chars;
				break;

			case 'num':
				var characters = '1234567890' + addon_chars;
				break;

			case 'def':
				var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-' + addon_chars;
				break;

			default:
				var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-' + addon_chars;
				// console.log(`Sorry, we are out of ${expr}.`);
				break;
		}
		
		var charactersLength = characters.length;
		for ( var i = 0; i < len; i++ ) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	}
























	// ============================================================
	// ============================================================
	// 							Biscuits
	// ============================================================
	// ============================================================

	// set cookies. from https://www.w3schools.com/js/js_cookies.asp

	cookie_set(cname, cvalue, exdays) {
		if ( typeof cname == 'undefined' || cvalue == 'undefined' || exdays == 'undefined' ) {
			console.log(`lizard's biscuits lack chocolate!`)
			return
		}
		const d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		let expires = 'expires='+d.toUTCString();
		document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
	}

	cookie_get(cname) {
		let name = cname + '=';
		let ca = document.cookie.split(';');
		for(let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}


















	// ============================================================
	// ============================================================
	// 							text getter
	// ============================================================
	// ============================================================

	// smart recursive text getter

	imtext(nd) {
		var element = nd, text = '';
		for (var i = 0; i < element.childNodes.length; ++i){
			if (element.childNodes[i].nodeType === Node.TEXT_NODE){
				text += element.childNodes[i].textContent;
			}
		}
		return text
	}





















	// ============================================================
	// ============================================================
	// 							Text to buffer
	// ============================================================
	// ============================================================

	// copy smth to ctrl+c
	copytext(l3text){
		var $temp = $('<input style="opacity: 0;position: absolute;">');
		$('body').append($temp);
		$temp.val(l3text).select();
		document.execCommand('copy');
		$temp.remove();
	}




















	// ============================================================
	// ============================================================
	// 							RGB to HEX
	// ============================================================
	// ============================================================

	// convert rgb to hex
	rgb2hex(rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		function hex(x) {
			return ('0' + parseInt(x).toString(16)).slice(-2);
		}
		return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}






















	// ============================================================
	// ============================================================
	// 							Download text
	// ============================================================
	// ============================================================


	// generate a file download
	// simple, but way too simple sometimes
	// there are some BLOB approaches...
	// although this does work without any problems for 10+ mb files
	textdl(filename='lizard.txt', text='iguana') {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}















	// ============================================================
	// ============================================================
	// 						Smart encode/decode
	// ============================================================
	// ============================================================


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






















	// ============================================================
	// ============================================================
	// 					remove duplicates from an array
	// ============================================================
	// ============================================================

	/*
	https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
	*/
	// deletes duplicates from given array
	rmdupli(a) {
	   return Array.from(new Set(a));
	}


















	// ============================================================
	// ============================================================
	//       evaluate html. Should be a little faster than jQuery
	// ============================================================
	// ============================================================

	ehtml(s)
	{
		var shit = document.createElement('div');
		shit.innerHTML = s
		return shit.children[0]
	}

















	// ============================================================
	// ============================================================
	// 				Delete nth character from a string
	// ============================================================
	// ============================================================

	// st - input string OR array
	// nth - every n character
	// use - if set to true, will return every n character
	// if set to false or not set, will return a string with every n character deleted
	// smartass: Works with arrays too
	delnthchar(st, nth, use)
	{
		if (st.toString() == ''){ return ''}

		if (Array.isArray(st)){
			var todel = st;
		}else{
			var todel = st.toString().split('');
		}

		var nthc = 1
		var delres = []
		for (var count in todel)
		{
			if (use){
				if (nthc != nth){
					nthc += 1
				}else{
					delres.push(todel[count])
					var nthc = 1
				}
			}else{
				if (nthc != nth){
					delres.push(todel[count])
					nthc += 1
				}else{
					var nthc = 1
				}
			}
		}
		return delres.join('')
	}


















	// ============================================================
	// ============================================================
	// 				Check if arrays have identical elements
	// ============================================================
	// ============================================================

	// returns true if an array contains any element which is not present in another array
	// inwhat - array to check against
	// what - input array
	array_is_same(what=[], inwhat=[], return_elems=false) {
	    var magix = what.filter(f => !inwhat.includes(f));
	    if (return_elems == true){
	    	return magix
	    }else{
	    	return magix.length > 0
	    }
	}





























	// ============================================================
	// ============================================================
	// 					base64 to image blob
	// ============================================================
	// ============================================================

	// takes raw base64 string and converts it to imageurl
	b64toimg(b64='', imgtype='*'){
		if (b64 == ''){return null}
		var bytes = this.base64DecToArr(b64)
		var blob = new Blob([bytes], {type: `image/${imgtype}`});
		var imageUrl = (window.URL || window.webkitURL).createObjectURL(blob);
		return imageUrl
	}






















	// ============================================================
	// ============================================================
	// 					Other
	// ============================================================
	// ============================================================


	// load user script
	// specify what script to load
	// (link to .js)
	// beware of gayshit CORS policy.
	/*
	function load_dasboat(uscript)
	{
		// $('body').append('<div>loaded shit</div>')
		function success()
		{
			// var $ = window.jQuery;
			console.log('liz3_loaded_userscript');
			// $('body').append('<div>loaded shit</div>');
		}
		var startingTime = new Date().getTime();
		// Load the script
		var script = document.createElement('SCRIPT');
		script.src = uscript;
		script.type = 'text/javascript';
		script.onload = function() {
			// var $ = window.jQuery;
			$(function() {
				var endingTime = new Date().getTime();
				var tookTime = endingTime - startingTime;
				console.log('l3UScript loaded in ' + tookTime + ' milliseconds');
				// $('body').append('<div>loaded shit</div>')
			});
		};
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	*/


}
window.lizard = new iguana();

