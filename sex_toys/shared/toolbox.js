
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
	};

	get info() {
		return `Lizard's toybox. Version 0.32`
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
				  objects = objects.concat(find_objects(obj[i], key, val));    
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
				  objects = objects.concat(find_values(obj[i], key));
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
				  objects = objects.concat(find_keys(obj[i], val));
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
		for ( var i = 0; i < length; i++ ) {
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
			console.log(`lizard\'s biscuits lack chocolate!`)
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
	// 							Text to buffer
	// ============================================================
	// ============================================================


	// copy smth to ctrl+c
	copytext(l3text)
	{
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
	// 							Python-like range()
	// ============================================================
	// ============================================================

	// python-like range()
	range(start, stop, step)
	{
		star = 0;
		sto = 17;
		ste = 1;
		motd = 'python range iterator error: strings are not allowed';
		// todo: this is some next-level retarded fucking shit
		// I really deserve to die in terrifying agony of a big xenomorph eating me alive for doing such fucking shit.
		if (typeof start == 'undefined' && typeof stop == 'undefined' && typeof step == 'undefined' )
		{
			console.log('python range iterator error: no arguments given');
			return []
		}
		if ( typeof start != 'undefined' && isNaN(parseInt(start)) )
		{
			console.log(motd)
			return []
		}
		if ( typeof stop != 'undefined' && isNaN(parseInt(stop)) )
		{
			console.log(motd)
			return []
		}
		if ( typeof step != 'undefined' && isNaN(parseInt(step)) )
		{
			console.log(motd)
			return []
		}

		if (typeof start != 'undefined' && typeof stop == 'undefined' && typeof step == 'undefined' )
		{
			sto = parseInt(start);
		}
		if ( typeof stop != 'undefined' )
		{
			sto = parseInt(stop);
			star = parseInt(start);
		}
		if ( typeof step != 'undefined' )
		{
			ste = parseInt(step)
		}
		if ( parseInt(start) > 9999999 || parseInt(stop) > 9999999 )
		{
			console.log('python range invalid range: value too high');
			return []
		}
		
		tgt_result = []
		eligible = true
		while (eligible) {
			if (star < sto)
			{
				tgt_result.push(star)
				star += ste
			}else{
				return tgt_result
			}
		}
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
	// 					Other
	// ============================================================
	// ============================================================

	// beware: this wont stfu til it finds what it's looking for
	// check whether element exists or not.
	// todo: improve functionality
	// insert a selector with no $
	// todo: make it work like client state on change in XMLHttpRequest
	/*
	function liz3_mviewfinder(search_what, trigger_func, interval)
	{
		if (typeof search_what == 'undefined' || typeof trigger_func == 'undefined' || typeof interval == 'undefined' || isNaN(interval) )
		{
			console.log('liz3 viewfinder bad arguments !')
		}else{
			let greet = function(){
				console.log('Howdy!');
				console.log(interval);

				if ($(search_what).length < 1)
				{
					setTimeout(greet, interval);
				}else{
					console.log('found_shit');
					trigger_func()
				}
			};
			
			if ($(search_what).length < 1)
			{
				setTimeout(greet, interval);
			}
		}

	}
	*/


	// load user script
	// specify what script to load
	// (link to .js)
	// beware of gayshit CORS policy.
	/*
	function liz3_load_dasboat(uscript)
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


