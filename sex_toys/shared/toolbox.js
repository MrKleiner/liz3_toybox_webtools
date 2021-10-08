// A dummy function to indicate that the toolbox was loaded
function liz3_toolbox_stuff()
{
	console.log('liz3_loaded_ver_0_32');
	return 'liz3_loaded_ver_0_32'
}


// beware: this wont stfu til it finds what it's looking for
// check whether element exists or not.
// todo: improve functionality
// insert a selector with no $
// todo: make it work like client state on change in XMLHttpRequest
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
				eval(trigger_func)()
			}
		};
		
		if ($(search_what).length < 1)
		{
			setTimeout(greet, interval);
		}
	}

}




// sort elements ( broken )
// what - elem to sort, pseudo selector
// where - container where elem is, selector
// how - asc for ascending and desc for descending
// selector for number source
// todo: The way this could possibly work: Generate array, sort it and then append from it back to target
/*
function sorter_snorter(what, where, by, how)
{
	where.each(function(){
		$(this).html(
			$(this).find(what)).sort(function(a, b) {
				eval(`
				let dsa = parseInt($(a).eq(0).` + by + `),
					dsb = parseInt($(b).eq(0).` + by + `);
				`);
				console.log(how)
				if (how == 'asc')
				{
					return (dsa > dsb ? -1 : (dsa > dsb) ? 1 : 0);
				}
				if (how == 'desc')
				{
					return (dsa < dsb ? -1 : (dsa < dsb) ? 1 : 0);
				}

			})
	});
}
*/






// From github. Json/object searcher
function liz3_getObjects(obj, key, val) {
      var objects = [];
      for (var i in obj) {
          if (!obj.hasOwnProperty(i)) continue;
          if (typeof obj[i] == 'object') {
              objects = objects.concat(getObjects(obj[i], key, val));    
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
  function liz3_getValues(obj, key) {
      var objects = [];
      for (var i in obj) {
          if (!obj.hasOwnProperty(i)) continue;
          if (typeof obj[i] == 'object') {
              objects = objects.concat(getValues(obj[i], key));
          } else if (i == key) {
              objects.push(obj[i]);
          }
      }
      return objects;
  }


  // return an array of keys that match on a certain value
  function liz3_getKeys(obj, val) {
      var objects = [];
      for (var i in obj) {
          if (!obj.hasOwnProperty(i)) continue;
          if (typeof obj[i] == 'object') {
              objects = objects.concat(getKeys(obj[i], val));
          } else if (obj[i] == val) {
              objects.push(i);
          }
      }
      return objects;
  }

/*
var json = '{"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","ID":"44","str":"SGML","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}';

var js = JSON.parse(json);

//example of grabbing objects that match some key and value in JSON
console.log(getObjects(js,'ID','SGML'));
//returns 1 object where a key names ID has the value SGML

//example of grabbing objects that match some key in JSON
console.log(getObjects(js,'ID',''));
//returns 2 objects since keys with name ID are found in 2 objects

//example of grabbing obejcts that match some value in JSON
console.log(getObjects(js,'','SGML'));
//returns 2 object since 2 obects have keys with the value SGML

//example of grabbing objects that match some key in JSON
console.log(getObjects(js,'ID',''));
//returns 2 objects since keys with name ID are found in 2 objects

//example of grabbing values from any key passed in JSON
console.log(getValues(js,'ID'));
//returns array ["SGML", "44"] 

//example of grabbing keys by searching via values in JSON
console.log(getKeys(js,'SGML'));
//returns array ["ID", "SortAs", "Acronym", "str"] 

*/



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
function liz3_rndwave(length, method, addchars) {
    var result           = '';
	/*
	if (method == 'flac')
	{
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-()=+*#/!&?<>$~';
	}else{
	    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
	}
	*/
	var addon_chars = '';
	if (typeof addchars == 'undefined')
	{
		var addon_chars = '';
	}else{
		var addon_chars = addchars.toString().replaceAll(' ', '');
	}
	
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

// console.log(makeid(16));





// set cookies. from https://www.w3schools.com/js/js_cookies.asp

function liz3_setCookie(cname, cvalue, exdays) {
	if ( typeof cname == 'undefined' || cvalue == 'undefined' || exdays == 'undefined' ) {
		console.log('lizard\'s biscuits lack chocolate!')
		return
	}
	const d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = 'expires='+d.toUTCString();
	document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function liz3_getCookie(cname) {
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

/*
function liz3_checkCookie() {
  let user = getCookie('username');
  if (user != '') {
    alert('Welcome again ' + user);
  } else {
    user = prompt('Please enter your name:', '');
    if (user != '' && user != null) {
      setCookie('username', user, 365);
    }
  }
}
*/


// load user script
// specify what script to load
// (link to .js)
// beware of gayshit CORS policy.
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


// copy smth to ctrl+c
// theoretically - very reliable
function liz3_copytext(l3text)
{
	var $temp = $('<input style="opacity: 0;position: absolute;">');
	$('body').append($temp);
	$temp.val(l3text).select();
	document.execCommand('copy');
	$temp.remove();
}


// convert rgb to hex
// kinda offers smart parse ? 
function liz3_rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ('0' + parseInt(x).toString(16)).slice(-2);
    }
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

// generate a file download
// simple, but way too simple sometimes
// there are some BLOB approaches...
// although this does work without any problems for 10+ mb files
function liz3_text_dl(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}



// capitalize string
String.prototype.lizcap = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// python things
function str(inp)
{
	return inp.toString()
}

function int(inp)
{
	return parseInt(inp)
}


// python-like range()
function range(start, stop, step)
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




// deletes duplicates from given array
function liz3_rmdupli(a) {
   return Array.from(new Set(a));
}