// check whether element exists or not.
// todo: improve functionality
function mviewfinder(search_what, trigger_func, interval)
{
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