// Here's a touching story: Once upon a time you died and I lived happily ever after. The end.


// Fucking asshole yt devs pretend to be big boiz who dont need jQuery. Fuck yall. Ill load it myself
(function() {
    var startingTime = new Date().getTime();
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
    	var $ = window.jQuery;
      $(function() {
            var endingTime = new Date().getTime();
            var tookTime = endingTime - startingTime;
            // window.alert("jQuery is loaded, after " + tookTime + " milliseconds!");
            console.log("jQuery is loaded, after " + tookTime + " milliseconds!");
        });
    };
    document.getElementsByTagName("head")[0].appendChild(script);
})();





// =================================================================
//	innit
// =================================================================


// alright, so you wanna save that sweet lizard porn before it gets deleted from youtube, because youtube is a pussy

// basically, same fucking shit as usual
document.addEventListener('click', event => {
    console.log("click_registered");
	
	// this part is only responsible for main page clicks
    const yt_list_item = event.target.closest('.yt-icon-button');
    	if (yt_list_item)
        {
            console.log("fuck you");
			var con_menu = $("ytd-popup-container").find("#contentWrapper");

			if ($(con_menu).hasClass( "initted" ))
			{
				console.log("we have class")
			}else{
				console.log("No class. Add one")
				$(con_menu).addClass("initted");
				
				$(con_menu).find("#items").children().eq(3).after('<div class="urethral_dilator">Piss</div>');
				
			}
			
			
        }
});



function save_vid()
{
	console.log("svae rrr sss")

	// var elHtml_crypt = document.querySelector(".super_canvas").innerHTML;
	var elHtml_crypt = "this_is_link";
	
	// console.log(elHtml)
	
	let cgi_script = "cgi-bin/hello.py"
	

		var blob = new Blob([elHtml], {type: 'text/plain'});
		var cgi_request = new XMLHttpRequest();
		cgi_request.open('POST', cgi_script, true);
		cgi_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		
		cgi_request.responseType = 'text';
		
		cgi_request.onreadystatechange = function() {
		
		  
		  
			if(cgi_request.readyState == 4 ) {
				console.log(cgi_request.responseText)
				if (cgi_request.responseText.trim() == "saved_succesfully")
				{	
					$(".save_indicator").css('background', 'green');
					console.log("WE GOT OKK RESPONSE")
				}else{
					$(".save_indicator").css('background', 'red');
					console.log("Somethings wrong I can feel it")
				}
				
			}
		  
		  
		}
		cgi_request.send(blob);
	
	

}