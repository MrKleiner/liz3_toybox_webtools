// ==UserScript==
// @name         Steam addon parser
// @namespace    http://tampermonkey.net/
// @version      0.52
// @description  And THIS is my weapon...
// @author       Heavy Weapons Guy
// @match        https://steamcommunity.com/*
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

// css base64. Autogenerated.
window.super_css = "LyogZnJvbSBzcmMgICovCgoKCi8qCi5ub2NsaWNrCnsKICBhbGw6IHVuc2V0Owp9CiovCi5zdXBlcl9mdWNrX3lvdQp7CiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50Owp9CgoudGVzdAp7CiAgY29sb3I6IHJlZCAhaW1wb3J0YW50Owp9Cgouc3VwZXJfZnVja195b3UgKgp7CiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50Owp9CgouaW5mb190YWJsZQp7CiAgZGlzcGxheTogZmxleCAhaW1wb3J0YW50OwogIC8qCiAgcG9zaXRpb246IGFic29sdXRlOwogIGxlZnQ6IDI1cHg7CiAgdG9wOiA1MDBweDsKICB3aWR0aDogNDAwcHg7CiAgei1pbmRleDogOTk5OTk5OTk7CiAgKi8KICBjb2xvcjogd2hpdGU7CiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjUpOwogIHBhZGRpbmc6IDVweDsKICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOwp9CgoucGFnZV9saXN0X2xvYWRlcgp7CiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50Owp9Cgoubm9jbGljawp7CiAgZGlzcGxheTogZmxleDsKICB3aWR0aDogMTAwJTsKICBjb2xvcjogd2hpdGU7CiAgdXNlci1zZWxlY3Q6IG5vbmUgIWltcG9ydGFudDsKICBwb2ludGVyLWV2ZW50czogbm9uZSAhaW1wb3J0YW50OwogIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSk7CgogIAp9CgoKLmluZm9fdGFibGVfc3RhdHMKewogIHVzZXItc2VsZWN0OiBub25lICFpbXBvcnRhbnQ7CiAgcG9pbnRlci1ldmVudHM6IG5vbmUgIWltcG9ydGFudDsKfQoKQC1tb3otZG9jdW1lbnQgdXJsLXByZWZpeCgpIAp7CiAgLm5vY2xpY2sgCiAgewogICAgbWFyZ2luLXRvcDogMjhweDsKICB9Cn0KCgovKgo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgpTZXggdG95cyBtZW51IHN0YXJ0Cgo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CiovCgovKgoucG1rN2pucWcgaW1nOmhvdmVyCnsKICBmaWx0ZXI6IGdyYXlzY2FsZSgxMDAlKTsKCn0KKi8KQGltcG9ydCB1cmwoImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9Um9ib3RvOndnaHRAMTAwJmRpc3BsYXk9c3dhcCIpOwoKLyoKQGltcG9ydCB1cmwoImh0dHBzOi8vZGwuZHJvcGJveC5jb20vcy9yM2tobXlwNGtqcG95bWkvZHJvaWRzYW5zLnR0Zj9kbD0wIik7CiovCgpAZm9udC1mYWNlIAp7CiAgICBmb250LWZhbWlseTogImJsZW5kZXIiOwogICAgc3JjOiB1cmwoImh0dHBzOi8vZGwuZHJvcGJveC5jb20vcy9yM2tobXlwNGtqcG95bWkvZHJvaWRzYW5zLnR0Zj9kbD0wIik7Cn0KCi5jbGFzc19oaWRkZW4KewogIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsKfQoKLm5vc2VsZWN0CnsKICAtd2Via2l0LXRvdWNoLWNhbGxvdXQ6IG5vbmU7CiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTsKICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7CiAgLW1vei11c2VyLXNlbGVjdDogbm9uZTsKICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7CiAgdXNlci1zZWxlY3Q6IG5vbmU7Cn0KCi5mbGlwX3gKewogIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZVgoLTEpOwogIHRyYW5zZm9ybTogc2NhbGVYKC0xKTsKfQoKLmVsZW1faG92ZXI6aG92ZXIKewogIGZpbHRlcjogZ3JheXNjYWxlKDEwMCUpOwp9Ci8qCmltZwp7CiAgbWFyZ2luLXRvcDogOTBweDsKICB3aWR0aDogMzAwcHg7Cn0KKi8KLmJtZW51X3Jvb3QKewogIHotaW5kZXg6IDk5OTk5OTsKICBwb3NpdGlvbjogZml4ZWQ7CiAgd2lkdGg6IDIwMHB4OwogIGRpc3BsYXk6IGZsZXg7CiAgY29sb3I6ICNFNkU2RTY7CiAgZm9udC1mYW1pbHk6ICdibGVuZGVyJywgc2Fucy1zZXJpZjsKICBmb250LXNpemU6IDEycHg7Cn0KCi5ibWVudV9tZW51CnsKICBkaXNwbGF5OiBmbGV4OwogIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47CiAgd2lkdGg6IDEwMCU7CiAgaGVpZ2h0OiAxMDAlOwogIGJhY2tncm91bmQ6IHJnYmEoMzEsIDMxLCAzMSwgMC45MzcpOwogIGJvcmRlcjogMXB4IHNvbGlkICMxOTE5MUE7CiAgYm9yZGVyLXJhZGl1czogNnB4OwogIHBhZGRpbmc6IDVweCAxcHggNXB4IDFweDsKICAKICAKICAtd2Via2l0LWJveC1zaGFkb3c6IDBweCAxcHggM3B4IDBweCByZ2JhKDAsMCwwLDAuOSk7IAogIGJveC1zaGFkb3c6IDBweCAxcHggM3B4IDBweCByZ2JhKDAsMCwwLDAuOSk7Cn0KCi5ibWVudV9lbnRyeQp7CiAgcGFkZGluZzogMnB4IDBweCAycHggMzBweDsKICBkaXNwbGF5OiBmbGV4OwogIG1hcmdpbi10b3A6IDJweDsKfQoKLmJtZW51X2VudHJ5OmhvdmVyCnsKICBiYWNrZ3JvdW5kOiAjNTY4MEMyOwp9CgouYm1lbnVfaGVhZGVyCnsKICBwYWRkaW5nOiAwcHggMHB4IDJweCAxMHB4OwogIGRpc3BsYXk6IGZsZXg7CiAgbWFyZ2luLXRvcDogMnB4OwogIGNvbG9yOiAjYTVhNWE1Owp9CgouYm1lbnVfc2VwYXJhdG9yCnsKICBoZWlnaHQ6IDFweDsKICBkaXNwbGF5OiBmbGV4OwogIG1hcmdpbjogM3B4IDBweCAzcHggMHB4OwogIGJhY2tncm91bmQ6ICMzOTM5Mzk7Cn0KCi8qCj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KClNleCB0b3lzIG1lbnUgRU5ECgo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ciov";

$(document).ready(function(){
    $("body").append('<style>' + atob(super_css) + '</style>');
});
// modes

// img flip mode
window.img_flip_mode = 0;

// hax init
window.hax_innit = 1;

//lock menu
window.menu_lock = 0;

//====================================
//  pootis. Log mouse position
//====================================
document.addEventListener('mousemove', function (e) {
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
        $(".bmenu_root").addClass("class_hidden");
    }

    // Open menu on shortcut. Todo: customizable shorcut
    if ( zEvent.altKey  &&  zEvent.keyCode == 87  ) {  // case sensitive
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
    // console.log("click_registered");


    // Close hax if clicked outside
    const bmenu_close = event.target.closest('.bmenu_menu');
    if (bmenu_close)
    {
        console.log("clicked_a_menu");
    }else{
        // console.log("clicked_not_menu");
        $(".bmenu_root").addClass("class_hidden");
    }


    const bmenu_entry = event.target.closest('.bmenu_entry');
    if (bmenu_entry)
    {
        console.log("clicked_on_an_entry");
        // console.log($(bmenu_entry).attr("bmenu_opt"));


        // Built-in img flipper
        if ($(bmenu_entry).attr("bmenu_opt") == "img_flip")
        {
            console.log("imgflipped");
            //  img_flip(bmenu_entry);
            window.img_flip_mode = 1;
            window.menu_lock = 1;
            $("img").addClass("elem_hover");
            $(".bmenu_root").addClass("class_hidden");
        }

        if ($(bmenu_entry).attr("bmenu_opt") == "pizza")
        {
            counter_initializer()
            console.log("counting");
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










function counter_initializer()
{
    $("#leftContents *").remove();
    window.current_profile = $("#global_actions a.user_avatar").attr("href").split('/');
    window.current_profile_id = current_profile[4];
    window.total_addon_amount = $(".workshopBrowsePagingWithBG .workshopBrowsePagingInfo").text().split(' ');
    $("#leftContents").attr("id", "leftContents_lizard");
    $("body").append('<div class="page_list_loader"></div>');
    $("#leftContents_lizard").append('<div class="info_table"><div class="info_table_stats"><div class="stats_page">Page: </div><div class="stats_list_item">Item: </div><br><br><div class="stats_list_ded_addons">Ded addons: 0</div></div></div>');
    window.first_page_link = "https://steamcommunity.com/id/" + current_profile_id + "/myworkshopfiles/?appid=4000&browsefilter=mysubscriptions&p=1&numperpage=30 #leftContents";
    window.super_counter = 0;
    window.page_counter = 1;
    window.total_page_amount = 2;
    window.total_ded_addons_counter = 0;
    window.total_subscriptions_amount = "null";

    // perform very initial load of the first page
    $( ".page_list_loader" ).load( first_page_link, function() {
        console.log("initial load of page 1");
        window.total_page_amount = parseInt( $("#leftContents .workshopBrowsePagingControls .pagelink:eq(-1)").text() );
        $(".stats_page").text("Page: " + 1 + " / " + total_page_amount);
        total_addon_amount_counter()
        // addon_list_checker()
    });
}

// count all addons
function total_addon_amount_counter()
{
	$(".page_list_loader *").remove();
	var last_page_link = first_page_link.replace("mysubscriptions&p=1", "mysubscriptions&p=" + total_page_amount);
	console.log("parsing addon amount");

	$( ".page_list_loader" ).load( last_page_link, function() {
		var count_addons_based_on_page_amount = 30 * (total_page_amount - 1);
		var last_page_subscription_amount = $('#leftContents .workshopItemSubscription[id*="Subscription"]').length
		window.total_subscriptions_amount = 0;
		window.constant_total_subscriptions_amount = count_addons_based_on_page_amount + last_page_subscription_amount;
		// addon_list_checker()
		midstep_because_im_stupid()
	});
}

function midstep_because_im_stupid()
{
	$( ".page_list_loader" ).load( first_page_link, function() {
	  console.log("initial load of page 1");
	  window.total_page_amount = parseInt( $("#leftContents .workshopBrowsePagingControls .pagelink:eq(-1)").text() );
	  $(".stats_page").text("Page: " + 1 + " / " + total_page_amount);
	  // total_addon_amount_counter()
	  addon_list_checker()
	});
}

function addon_list_checker()
{
    $('#leftContents .workshopItemSubscription[id*="Subscription"]').each(function(){
        console.log(super_counter);

        $(this).append('<div class="super_fuck_you temp_loader_' + $(this).attr("id") + '"></div>');
        var current_link = $(this).find(".workshopItemPreviewHolderFloatLeft a").attr("href") + " #message";
        var current_id = $(this).attr("id").replace("Subscription", "");
        var current_name = $(this).find(".workshopItemSubscriptionDetails a .workshopItemTitle").text();
        $(this).find(".super_fuck_you").load( current_link, function() {

			if ($(this).find("#message h3").length > 0)
			{
				console.log("HA, RED ERROR");
				$(".info_table").append('<br> <br> <a href="#" class="noclick">This awesome addon is gone! Reduced to atoms!</a>' + '<div class="info_pootis">' + current_name + '</div>' + '<div class="info_pootis">' + current_id + '</div>');
				window.total_ded_addons_counter = total_ded_addons_counter + 1;
				$(".stats_list_ded_addons").text("Ded addons: " + total_ded_addons_counter);
			}else{
				console.log("no error 4 u");
			}
			$(".super_fuck_you").remove();
			window.super_counter = super_counter + 1;
			window.total_subscriptions_amount = total_subscriptions_amount + 1;
			$(".stats_list_item").text("Item: " + super_counter + "/30" + "  a total of " + total_subscriptions_amount + "/" + constant_total_subscriptions_amount );
			super_addon_page_loader()

        });

    });
}

function super_addon_page_loader()
{
    if ( page_counter > total_page_amount )
    {
        console.log("enough sex for now. give your dick a rest");
    }else{
        if ( super_counter == 30 )
        {
            console.log("ejacuated");
            $(".page_list_loader *").remove();
            window.super_counter = 0;
            window.page_counter = page_counter + 1;
            $(".stats_page").text("Page: " + page_counter + " / " + total_page_amount);
            var super_next_page = 'https://steamcommunity.com/id/' + current_profile_id + '/myworkshopfiles/?appid=4000&browsefilter=mysubscriptions&p=' + page_counter + '&numperpage=30 #leftContents';
            $( ".page_list_loader" ).load( super_next_page, function() {
              console.log("trying to load next page");
              addon_list_checker()
            });
        }else{
            console.log("Havent reached the last item on a page. Pls wait");
        }
    }
}

