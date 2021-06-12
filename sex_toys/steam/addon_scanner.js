// $("body").append('<style>.super_fuck_you{display:none!important}.super_fuck_you *{display:none!important}.info_table{display:flex!important;color:white;background:rgba(0,0,0,0.5);padding:5px;flex-direction:column}.page_list_loader{display:none!important}.noclick{display:flex;width:100%;color:white;user-select:none!important;pointer-events:none!important;color:rgba(255,255,255,0.5)}.info_table_stats{user-select:none!important;pointer-events:none!important}</style>');
$("#leftContents *").remove();
var current_profile = $("#global_actions a.user_avatar").attr("href").split('/');
var current_profile_id = current_profile[4];
var total_addon_amount = $(".workshopBrowsePagingWithBG .workshopBrowsePagingInfo").text().split(' ');
$("#leftContents").attr("id", "leftContents_lizard");
$("body").append('<div class="page_list_loader"></div>');
$("#leftContents_lizard").append('<div class="info_table"><div class="info_table_stats"><div class="stats_page">Page: </div><div class="stats_list_item">Item: </div><br><br><div class="stats_list_ded_addons">Ded addons: 0</div></div></div>');
var first_page_link = "https://steamcommunity.com/id/" + current_profile_id + "/myworkshopfiles/?appid=4000&browsefilter=mysubscriptions&p=1&numperpage=30 #leftContents";
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
















/*
$("#leftContents *").remove();
var current_profile_id = $("#global_actions a").attr("href").split('/');
$("#leftContents").attr("id", "leftContents_lizard");
$("body").append('<div class="page_list_loader"></div>');
$("#leftContents_lizard").append('<div class="info_table"><div class="info_table_stats"><div class="stats_page">Page: 1</div><div class="stats_list_item">Item: 0/30</div></div></div>');
// $(".page_list_loader").load('https://steamcommunity.com/id/MrKleiner/myworkshopfiles/?appid=4000&browsefilter=mysubscriptions&p=1&numperpage=30 #leftContents');
var first_page_link = "https://steamcommunity.com/id/MrKleiner/myworkshopfiles/?appid=4000&browsefilter=mysubscriptions&p=1&numperpage=30 #leftContents";
window.super_counter = 0;
window.page_counter = 1;
window.total_page_amount = parseInt( $(".workshopBrowsePagingControls .pagelink:eq(-1)").text() )
$( ".page_list_loader" ).load( first_page_link, function() {
  console.log("initial load of page 1");
  addon_list_checker()
});
function addon_list_checker()
{
    $('#leftContents .workshopItemSubscription[id*="Subscription"]').each(function(){
        console.log(super_counter);

        $(this).append('<div class="super_fuck_you temp_loader_' + $(this).attr("id") + '"></div>');
        var current_link = $(this).find(".workshopItemPreviewHolderFloatLeft a").attr("href") + " #message";
        var current_id = $(this).attr("id").replace("Subscription", "");
        var current_name = $(this).find(".workshopItemSubscriptionDetails a .workshopItemTitle").text();
        $(this).find(".super_fuck_you").load( current_link, function() {
            if ($(this).find("#message h3").text() == "There was a problem accessing the item.  Please try again.")
            {
                console.log("HA, RED ERROR");
                $(".info_table").append('<br> <br> <a href="#" class="noclick">This awesome addon is gone! Reduced to atoms!</a>' + '<div class="info_pootis">' + current_name + '</div>' + '<div class="info_pootis">' + current_id + '</div>');
                // $(".stats_list_item").text("Item:" + super_counter + "/30");
            }else{
                console.log("no error 4 u");
                // $(".stats_list_item").text("Item:" + super_counter + "/30");
            }
            $(".super_fuck_you").remove();
            window.super_counter = super_counter + 1;
            $(".stats_list_item").text("Item: " + super_counter + "/30");
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
            $(".stats_page").text("Page: " + page_counter);
            var super_next_page = 'https://steamcommunity.com/id/MrKleiner/myworkshopfiles/?appid=4000&browsefilter=mysubscriptions&p=' + page_counter + '&numperpage=30 #leftContents';
            $( ".page_list_loader" ).load( super_next_page, function() {
              console.log("trying to load next page");
              addon_list_checker()
            });
            // addon_list_checker()
        }else{
            console.log("we havent ejacuated yet. Pls wait");
        }
    }
}
*/





// ===========================================================
//
// VERSION 2.0
// ===========================================================





/*
$("#leftContents *").remove();
var current_profile = $("#global_actions a.user_avatar").attr("href").split('/');
var current_profile_id = current_profile[4];
$("#leftContents").attr("id", "leftContents_lizard");
$("body").append('<div class="page_list_loader"></div>');
$("#leftContents_lizard").append('<div class="info_table"><div class="info_table_stats"><div class="stats_page">Page: 1</div><div class="stats_list_item">Item: 0/30</div></div></div>');
// $(".page_list_loader").load('https://steamcommunity.com/id/MrKleiner/myworkshopfiles/?appid=4000&browsefilter=mysubscriptions&p=1&numperpage=30 #leftContents');
var first_page_link = "https://steamcommunity.com/id/" + current_profile_id + "/myworkshopfiles/?appid=4000&browsefilter=mysubscriptions&p=1&numperpage=30 #leftContents";
window.super_counter = 0;
window.page_counter = 1;
window.total_page_amount = parseInt( $(".workshopBrowsePagingControls .pagelink:eq(-1)").text() )
$( ".page_list_loader" ).load( first_page_link, function() {
  console.log("initial load of page 1");
  addon_list_checker()
});
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
                // $(".stats_list_item").text("Item:" + super_counter + "/30");
            }else{
                console.log("no error 4 u");
                // $(".stats_list_item").text("Item:" + super_counter + "/30");
            }
            $(".super_fuck_you").remove();
            window.super_counter = super_counter + 1;
            $(".stats_list_item").text("Item: " + super_counter + "/30");
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
            $(".stats_page").text("Page: " + page_counter);
            var super_next_page = 'https://steamcommunity.com/id/' + current_profile_id + '/myworkshopfiles/?appid=4000&browsefilter=mysubscriptions&p=' + page_counter + '&numperpage=30 #leftContents';
            $( ".page_list_loader" ).load( super_next_page, function() {
              console.log("trying to load next page");
              addon_list_checker()
            });
            // addon_list_checker()
        }else{
            console.log("we havent ejacuated yet. Pls wait");
        }
    }
}
*/

