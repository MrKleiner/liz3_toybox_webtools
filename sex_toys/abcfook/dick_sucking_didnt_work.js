// img flip mode
var img_flip_mode = 0;

// hax init
var hax_innit = 1;

//lock menu
var menu_lock = 0;

//====================================
//  pootis
//====================================
		document.addEventListener('mousemove'
			, function(e){
				var x = e.clientX;
				var y = e.clientY
				window.cs_x = x + "px";
				window.cs_y = y + "px";
			});
//====================================
//  pootis
//====================================


function img_flip(selector_fuck)
{
  $(selector_fuck).toggleClass("flip_x");
}




// innit hax

document.addEventListener ("keydown", function (zEvent) {

	if ( zEvent.keyCode == 27)
    {
      window.img_flip_mode = 0;
      window.menu_lock = 0;
      $("img").removeClass("elem_hover");
    }





	if ( zEvent.keyCode == 87) {  // case sensitive
    if (hax_innit == 1)
      {
        $("body").append('<div class="bmenu_root class_hidden"> <div class="bmenu_menu"> <div class="bmenu_header noselect">Sex Toys</div> <div class="bmenu_separator"></div> <div bmenu_opt="img_flip" class="bmenu_entry noselect">Flip image</div> <div bmenu_opt="pizza" class="bmenu_entry noselect">Order pizza</div> </div> </div>');
        window.hax_innit = 0;
        console.log("hax_created");

				$(".bmenu_root")
				.css({
					left: cs_x,
					top: cs_y,
				});

        $(".bmenu_root").removeClass("class_hidden");
      }else{

        if (menu_lock == 1)
          {
            console.log("menu_locked");
          }else{
            $(".bmenu_root")
            .css({
              left: cs_x,
              top: cs_y,
            });

            $(".bmenu_root").removeClass("class_hidden");
          }

      }

	}

});



// hax
document.addEventListener('click', event => {
	console.log("click_registered");


  // Close hax if clicked outside
	const bmenu_close = event.target.closest('.bmenu_menu');
  if (bmenu_close)
    {
      console.log("clicked_a_menu");
    }else{
      console.log("clicked_not_menu");
      $(".bmenu_root").addClass("class_hidden");
    }





	const bmenu_entry = event.target.closest('.bmenu_entry');
	if (bmenu_entry)
    {
      console.log("clicked_on_an_entry");
      // console.log($(bmenu_entry).attr("bmenu_opt"));

      if ($(bmenu_entry).attr("bmenu_opt") == "img_flip")
        {
          console.log("imgflipped");
        //  img_flip(bmenu_entry);
          window.img_flip_mode = 1;
          window.menu_lock = 1;
          $("img").addClass("elem_hover");
          $(".bmenu_root").addClass("class_hidden");
        }
    }




	const questionable_img = event.target.closest('img');
  if (img_flip_mode == 1)
    {

      if (questionable_img)
        {
          img_flip(questionable_img);
          window.img_flip_mode = 0;
          window.menu_lock = 0;
          $("img").removeClass("elem_hover");
        }

    }






});
// hax











document.addEventListener('contextmenu', function(ev) {
 //   ev.preventDefault();
   // alert('success!');
  console.log("right_click_out");

  const questionable_img = ev.target.closest('a');
  if (img_flip_mode == 1)
    {
        console.log("right_click_flip");

      if (questionable_img)
        {
            console.log("right_click_finally");
          img_flip(questionable_img.find('img'));
          window.img_flip_mode = 0;
          window.menu_lock = 0;
          $("img").removeClass("elem_hover");
          console.log("right_click_out");
        }

    }



    return false;
}, false);



/*
$( "img" ).contextmenu(function() {
  if (img_flip_mode == 1)
    {
      img_flip(this);
      window.img_flip_mode = 0;
      window.menu_lock = 0;
      $("img").removeClass("elem_hover");
      console.log("right_click_out");
      return false;
    }
});



*/