// ==UserScript==
// @name         DOOT
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  Telegram clientside aes
// @author       MrKleiner
// @match        https://web.telegram.org/
// @icon         https://www.google.com/s2/favicons?domain=telegram.org
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js
// @grant        none
// ==/UserScript==

/*
Disclaimer: Yes, I know that Telegram uses AES by default.
The point of this shit is to make sure that there's no PHYSICAL way to intercept the "message access password".
With this method - NOTHING password-related is being tossed into the network. All the decryptions and encryptions are completely client-side.

So even if there's a malicious FBI lizard with linux laptop sitting next to your house and monitoring all the traffic - he won't see any actual messages.
Altough this doesnt mean that he won't fuck you in the ass if he wanted to.

I mean, this should theoretically protect you from your Telegram password being stolen by MITM attack or something.
*/

// ====================================================
// ====================================================
//                  API DOCUMENTATION
// ====================================================
// ====================================================


// liz3 cookie config is an array, where
/*

0 - global enable
1 - local mute
2 - darkmode
3 - group igonre
4 - decrypt only
*/




// css placeholder
window.liz3_css_64 = 'PHN0eWxlIGlkPSJsaXozX2Nzc19zdHlsZV90YWciPi5uaWx7ZGlzcGxheTogbm9uZTt9PC9zdHlsZT4';

window.bmenu_spammer_html =
`
<div class="bmenu_creator_root illuminati_place class_hidden">
	<div class="bmenu_creator">
		<div class="bmenu_creator_header noselect">Toybox message spammer</div>
		<div class="bmenu_creator_body">
			<div class="bmenu_creator_body_left">
				<div class="bmenu_creator_l_row noselect">Message</div>
				<div class="bmenu_creator_l_row noselect">Interval</div>
				<div class="bmenu_creator_l_row noselect">Total count</div>
				<div class="bmenu_creator_l_row noselect">Notification frequency</div>
			</div>
			<div class="bmenu_creator_body_right">
				<div class="bmenu_creator_r_row">
					<input mrk_ect_tooltip="Message to send." value="lol" class="bmenu_row_text_input illuminati_msg"></input>
				</div>
				<div class="bmenu_creator_r_row">
					<input mrk_ect_tooltip="Interval between each message in seconds. Fractional values allowed." value="1" class="bmenu_row_text_input illuminati_int"></input>
				</div>
				<div class="bmenu_creator_r_row">
					<input mrk_ect_tooltip="Total number of messages to send." value="10" class="bmenu_row_text_input illuminati_count"></input>
				</div>
				<div class="bmenu_creator_r_row">
					<input mrk_ect_tooltip="Log the amount of sent messages in console every nth message." value="5" class="bmenu_row_text_input illuminati_info_freq"></input>
				</div>
			</div>
		</div>
		<div class="confirm_illuminati">
			<div class="bmenu_confirm_btn noselect align_self_center illuminati_confirm">OK</div>
			<div class="bmenu_confirm_btn noselect align_self_center cancel_illuminati">Cancel</div>
		</div>
	</div>
</div>
`;

window.liz3_pswd_changer_html =
`
<div id="global_password_changer" class="hover_editor_1_root pswd_editor class_hidden">
	<div class="hover_editor_1_btns pswd_editor_btns pswd_editor_btn_apply">OK</div>
	<div class="hover_editor_1_input_container pswd_editor_input_container">
		<input class="hover_editor_1_input pswd_editor_input" value="">
	</div>
	<div class="hover_editor_1_btns pswd_editor_btns pswd_editor_btn_cancel">Cancel</div>
</div>
`;


window.liz3_blender_menu =
`
<div class="bmenu_root">
	<div class="bmenu_menu">
		<div class="bmenu_header noselect">Sex Toys</div>
		<div class="bmenu_head_separator"></div>
		<div bmenu_opt="bmenu_imgflip" class="bmenu_entry noselect">
			<div class="bmenu_entry_left_side"></div>
			<div class="bmenu_entry_right_side">Flip image</div>
		</div>
		<div bmenu_opt="decrypt_pswd_changer" class="bmenu_entry noselect">
			<div class="bmenu_entry_left_side"></div>
			<div class="bmenu_entry_right_side">Set Password</div>
		</div>
		<div class="bmenu_separator"></div>
		<div bmenu_ischeckbox="1" bmenu_opt="enable_liz3" class="bmenu_entry noselect">
			<div class="bmenu_entry_left_side"></div>
			<div class="bmenu_entry_right_side">Enable liz3</div>
		</div>
		<div bmenu_ischeckbox="1" bmenu_opt="liz3_quick_mute" class="bmenu_entry noselect">
			<div class="bmenu_entry_left_side"></div>
			<div class="bmenu_entry_right_side">Liz3 quick mute</div>
		</div>
		<div bmenu_ischeckbox="1" bmenu_opt="liz3_group_ignore" class="bmenu_entry noselect">
			<div class="bmenu_entry_left_side"></div>
			<div class="bmenu_entry_right_side">Liz3 group ignore</div>
		</div>
		<div bmenu_ischeckbox="1" bmenu_opt="liz3_decrypt_only" class="bmenu_entry noselect">
			<div class="bmenu_entry_left_side"></div>
			<div class="bmenu_entry_right_side">Liz3 decrypt only</div>
		</div>
		<div class="bmenu_separator"></div>
		<div bmenu_ischeckbox="1" bmenu_opt="liz3_dark_theme_menu_call" class="bmenu_entry noselect">
			<div class="bmenu_entry_left_side"></div>
			<div class="bmenu_entry_right_side">Dark mode</div>
		</div>
		<div bmenu_opt="toybox_msg_spammer" class="bmenu_entry noselect">
			<div class="bmenu_entry_left_side"></div>
			<div class="bmenu_entry_right_side">Spammer</div>
		</div>
	</div>
</div>
`;


// cbid = selector for the checkbox, state = set the checkbox state to... 1 = true, 0 = false
function checkbox_activator(cbid, cstate)
{
    // var current_cbox = $("#" + cbid).closest(".disaster_checkbox_row");
    // var current_cbox_state = $(current_cbox).find(".disaster_checkbox_checkmark").attr("mgh_checkbox_checked");
    if ( cstate == "toggle" )
    {
        console.log('toggle command');
        if ( $(cbid).find('.bmenu_checkbox_checkmark').attr('bmenu_checkbox_checked') == "1" )
        {
            $(cbid).find(".bmenu_checkbox_checkmark").attr("bmenu_checkbox_checked", "0");
            $(cbid).removeClass("bmenu_checkbox_checked_bg");
            $(cbid).find(".bmenu_checkbox_checkmark").addClass("class_hidden");
        }else{
        // if ( $(cbid).find('.bmenu_checkbox_checkmark').attr('bmenu_checkbox_checked') == "0" )

            $(cbid).find(".bmenu_checkbox_checkmark").attr("bmenu_checkbox_checked", "1");
            $(cbid).addClass("bmenu_checkbox_checked_bg");
            $(cbid).find(".bmenu_checkbox_checkmark").removeClass("class_hidden");
        }
    }else{
        if (parseInt(cstate) > 0)
        {
            $(cbid).find(".bmenu_checkbox_checkmark").attr("bmenu_checkbox_checked", "1");
            $(cbid).addClass("bmenu_checkbox_checked_bg");
            $(cbid).find(".bmenu_checkbox_checkmark").removeClass("class_hidden");
        }

        if (parseInt(cstate) == 0)
        {
            $(cbid).find(".bmenu_checkbox_checkmark").attr("bmenu_checkbox_checked", "0");
            $(cbid).removeClass("bmenu_checkbox_checked_bg");
            $(cbid).find(".bmenu_checkbox_checkmark").addClass("class_hidden");
        }
    }


}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cookie_name) {
    var user = getCookie(cookie_name);
    if (user != "") {
        console.log('detected cookie "' + cookie_name + '" ' + 'with a value of ' + user);
        return false;
    } else {
        console.log('no cookie with the name "' + cookie_name + '" detected');
        return true;
    }
}



// setTimeout(function() { big_msngr_observer(); }, 5000);
$(document).ready(function(){

    window.mrk_ect_timer; // create container for tolltip timer
    window.mrk_ect_tooltip_timeout = 500; // tooltip timeout
    // check if we have config
    if ( checkCookie('liz3_config') )
    {
        setCookie('liz3_config', '1-0-0-0', 420);
        console.log('no liz3 config detected, falling back to defaults');
        window.liz3_system_enabled = 1;
        window.liz3_quick_mute = 0;
        window.liz3_dark_mode = 0;
        window.liz3_group_ignore_var = 0;
        window.liz3_decrypt_only_v = 0;
    }

    window.liz3_current_session_password = getCookie('liz3_cur_pswd');
    window.liz3_current_config = getCookie('liz3_config').split('-');

    window.liz3_system_enabled = parseInt(liz3_current_config[0]);
    window.liz3_quick_mute = parseInt(liz3_current_config[1]);
    window.liz3_dark_mode = parseInt(liz3_current_config[2]);
    window.liz3_group_ignore_var = parseInt(liz3_current_config[3]);
    window.liz3_decrypt_only_v = parseInt(liz3_current_config[4]);
    // window.liz3_quick_mute = 1;

    window.initializer_timeout = 0;
    window.tg_msg_edit_mode = 0;

    $("body").append(liz3_blender_menu);
    $('body').append(liz3_pswd_changer_html);
    look_at_telegram()
    console.log(getCookie('liz3_config'));
    liz3_dark_theme_page_load()
    $('body').append('<div id="liz3_required_css">' + atob(liz3_css_64) + '</div>');
    $('body').append('<div class="mrk_ect_tooltip_box noselect class_hidden">tolltip is nil</div>');
    // $('body').append('<div class="bmenu_creator_root illuminati_place class_hidden"> <div class="bmenu_creator"> <div class="bmenu_creator_header noselect">Toybox message spammer</div> <div class="bmenu_creator_body"> <div class="bmenu_creator_body_left"> <div class="bmenu_creator_l_row noselect">Message</div> <div class="bmenu_creator_l_row noselect">Interval</div> <div class="bmenu_creator_l_row noselect">Total count</div> <div class="bmenu_creator_l_row noselect">Notification frequency</div> </div> <div class="bmenu_creator_body_right"> <div class="bmenu_creator_r_row"> <input value="lol" class="bmenu_row_text_input illuminati_msg"></input> </div> <div class="bmenu_creator_r_row"> <input value="1" class="bmenu_row_text_input illuminati_int"></input> </div> <div class="bmenu_creator_r_row"> <input value="10" class="bmenu_row_text_input illuminati_count"></input> </div> <div class="bmenu_creator_r_row"> <input value="5" class="bmenu_row_text_input illuminati_info_freq"></input> </div> </div> </div> <div class="confirm_illuminati"> <div class="bmenu_confirm_btn noselect align_self_center illuminati_confirm">OK</div><div class="bmenu_confirm_btn noselect align_self_center cancel_illuminati">Cancel</div> </div> </div> </div>');
    $('body').append(bmenu_spammer_html);
    window.wtf_fuck_js_bmenu_root_height = $('.bmenu_root').outerHeight( true );
});

function liz3_set_config()
{
    checkbox_activator($('.bmenu_entry[bmenu_opt="enable_liz3"] .bmenu_checkbox'), liz3_current_config[0]);
    checkbox_activator($('.bmenu_entry[bmenu_opt="liz3_quick_mute"] .bmenu_checkbox'), liz3_current_config[1]);
    checkbox_activator($('.bmenu_entry[bmenu_opt="liz3_dark_theme_menu_call"] .bmenu_checkbox'), window.liz3_dark_mode);
    checkbox_activator($('.bmenu_entry[bmenu_opt="liz3_group_ignore"] .bmenu_checkbox'), window.liz3_group_ignore_var);
    checkbox_activator($('.bmenu_entry[bmenu_opt="liz3_decrypt_only"] .bmenu_checkbox'), window.liz3_decrypt_only_v);
}

function look_at_telegram()
{
    // Try to locate the mini messenger message grid. Got better solution for more accurate selector? Email us at "weylandyutani@ark.gal"
    if($('form .composer_rich_textarea').length > 0 && $('.im_history_message_wrap').closest('.im_history_messages_peer').length > 0 )
    {
        window.initializer_timeout = 1;
        // celebrate. Important info log
        console.log('found text field');
        // trigger message decryptor
        if ( liz3_system_enabled == 1 )
        {
            if ( window.liz3_decrypt_only_v == 0 )
            {
                init2();
            }

            tg_msgs_observer();
        }

    }else{
        // important info log, which informs us that no messenger presented on a page
        console.log('We aint found shit');
        // check if we've reached the timeout. If we've reached the timeout - it means that the page is done loading, but mini-messenger window did not appear
        if ( initializer_timeout == 0 )
        {
            // If we got here, then we havent found the messenger. Try again
            setTimeout( look_at_telegram, 250 );
        }

    }

}

function init2()
{
    $('.composer_rich_textarea').addClass('ded2 tg_original_msg_input');
    $('.im_send_field_wrap.hasselect').append('<textarea type="text" class="composer_rich_textarea liz3_alt_msg_input" dir="auto" placeholder="Write a message..."></textarea>');

   // setTimeout( tg_msgs_observer, 1500 );
    $(".liz3_alt_msg_input").on('keydown', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            if($('.liz3_alt_msg_input').val().length > 0)
            {
                if( e.shiftKey  &&  e.key === 'Enter' )
                {
                    console.log('thats gonna be a line break')
                }else{
                    console.log("input is full and we want to send");
                    if ( window.liz3_quick_mute == 1 )
                    {
                        message_mitm_copier(0)

                    }else{
                        if ( window.liz3_system_enabled == 1 && window.liz3_decrypt_only_v == 0)
                        {
                            if ( window.liz3_group_ignore_var == 1 )
                            {
                                if ( window.location.href.split('?p=')[1].charAt(0) == "u" || window.location.href.split('?p=')[1].charAt(0) == "@" )
                                {
                                    message_mitm_copier(1)
                                }else{
                                    // replace this command with a function !
                                    message_mitm_copier(0)
                                }
                            }else{
                                message_mitm_copier(1)
                            }

                        }else{
                            message_mitm_copier(0)
                        }

                    }

                    $('.im_submit').trigger('mousedown');
                    $('.liz3_alt_msg_input').val('');
                    setTimeout( make_input_great_again, 100 );
                    console.log('is it what Im thinking about');
                    // $('.liz3_alt_msg_input').focus();

                    /*
                    setTimeout(() => {
                        console.log('focus');
                        $('.liz3_alt_msg_input').blur();
                        $('.liz3_alt_msg_input').focus();
                    }, 10);
                    */
                    console.log('pre return');
                    return false;

                }
            }else{
                console.log("input is empty");
                return false;
            }
        }

        if (e.key === 'ArrowUp')
        {
            if($('.liz3_alt_msg_input').val().length > 0)
            {
                console.log('we have text in input - dont edit last msg');
            }else{

                var se = jQuery.Event("keydown");
                se.keyCode = 38;
                $('.tg_original_msg_input').trigger(se);

                setTimeout(() => {
                    $('.liz3_alt_msg_input').val($('.tg_original_msg_input').text());
                }, 15);
                setTimeout( make_input_great_again, 100 );

            }
        }
    });

    $('.icon.icon-slash').closest('.composer_command_btn').remove();
}

function tg_msgs_observer()
{
    let tg_msgs_feed_observer = new MutationObserver(function(mutation) {
        // log that there were changes
        console.log("msg list change logged");
        setTimeout( liz3_tg_decrypt_all_msgs, 25 );

    })

    let observerConfig = {
        attributes: true,
        childList: true,
        attributeOldValue: true,
        characterData: true,
        subtree: true
    }


    let tg_msgs_feed_container = $('.im_history.im_history_selectable .im_history_messages');

    for (i = 0; i < tg_msgs_feed_container.length; i++)
    {
        tg_msgs_feed_observer.observe(tg_msgs_feed_container[i], observerConfig);
    }
}







// =================================================
//
// MENU
//
// =================================================


// img flip mode
window.img_flip_mode = false;

// hax init
window.hax_innit = true;

//lock menu
window.menu_lock = false;

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
        window.img_flip_mode = false;
        window.menu_lock = false;
        $("img").removeClass("elem_hover");
    }

    if (  zEvent.altKey  &&  zEvent.keyCode == 87  ) {  // case sensitive
        if (hax_innit)
        {
            //
            // TODO: GET RID OF THE FUCKING INIT STAGE. IT'S USELESS TRASH !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // OR REMOVE THE CLASS_HIDDEN BEFORE MEASURING HEIGHT, AT LEAST
            //
            // ALSO THINK OF APPROPRIATE ORDER NO MATTER WHAT
            //

            /*
            $("body").append('<div class="bmenu_root class_hidden"> <div class="bmenu_menu"> <div class="bmenu_header noselect">Sex Toys</div> <div class="bmenu_head_separator"></div> <div bmenu_opt="bmenu_imgflip" class="bmenu_entry noselect"><div class="bmenu_entry_left_side"></div><div class="bmenu_entry_right_side">Flip image</div></div> </div> </div>');
            $('.bmenu_menu').append('<div bmenu_opt="decrypt_pswd_changer" class="bmenu_entry noselect"><div class="bmenu_entry_left_side"></div><div class="bmenu_entry_right_side">Set Password</div></div>');
            $('.bmenu_menu').append('<div class="bmenu_separator"></div>');
            $('.bmenu_menu').append('<div bmenu_ischeckbox="1" bmenu_opt="enable_liz3" class="bmenu_entry noselect"><div class="bmenu_entry_left_side"></div><div class="bmenu_entry_right_side">Enable liz3</div></div>');
            $('.bmenu_menu').append('<div bmenu_ischeckbox="1" bmenu_opt="liz3_quick_mute" class="bmenu_entry noselect"><div class="bmenu_entry_left_side"></div><div class="bmenu_entry_right_side">Liz3 quick mute</div></div>');
            $('.bmenu_menu').append('<div bmenu_ischeckbox="1" bmenu_opt="liz3_group_ignore" class="bmenu_entry noselect"><div class="bmenu_entry_left_side"></div><div class="bmenu_entry_right_side">Liz3 group ignore</div></div>');
            $('.bmenu_menu').append('<div bmenu_ischeckbox="1" bmenu_opt="liz3_decrypt_only" class="bmenu_entry noselect"><div class="bmenu_entry_left_side"></div><div class="bmenu_entry_right_side">Liz3 decrypt only</div></div>');
            $('.bmenu_menu').append('<div class="bmenu_separator"></div>');
            $('.bmenu_menu').append('<div bmenu_ischeckbox="1" bmenu_opt="liz3_dark_theme_menu_call" class="bmenu_entry noselect"><div class="bmenu_entry_left_side"></div><div class="bmenu_entry_right_side">Dark mode</div></div>');
            $('.bmenu_menu').append('<div bmenu_opt="toybox_msg_spammer" class="bmenu_entry noselect"><div class="bmenu_entry_left_side"></div><div class="bmenu_entry_right_side">Spammer</div></div>');
           */
           window.hax_innit = false;
            console.log("hax_created");

            $('.bmenu_entry[bmenu_ischeckbox="1"] .bmenu_entry_left_side').append(' <div class="bmenu_checkbox bmenu_checkbox_checked_bg"> <div class="bmenu_checkbox_checkmark" bmenu_checkbox_checked="1"></div> </div>');
            $('.bmenu_entry[bmenu_ischeckbox="1"]').removeAttr('bmenu_ischeckbox');
            liz3_set_config()

            $(".bmenu_root").removeClass("class_hidden");
            console.log($('.bmenu_root').outerHeight( true ));
            var calc_menu_y = cs_y;
            var calc_menu_x = cs_x;

            if (parseInt(cs_y) > ( window.innerHeight - $('.bmenu_root').outerHeight( true ) ) )
            {
                var calc_menu_y = parseInt(cs_y) - ((parseInt(cs_y) + $('.bmenu_root').outerHeight( true )) - window.innerHeight) - 20;
                console.log('calc y is=' + calc_menu_y + ' original y is=' + cs_y);
            }

            if (parseInt(cs_x) > ( window.innerWidth - $('.bmenu_root').outerWidth( true ) ) )
            {
                var calc_menu_x = parseInt(cs_x) - ((parseInt(cs_x) + $('.bmenu_root').outerWidth( true )) - window.innerWidth) - 20;
                console.log('calc x is ' + calc_menu_x + ' original x is ' + cs_x);
            }
            $(".bmenu_root")
                .css({
                left: calc_menu_x,
                top: calc_menu_y,
            });

        }else{

            if (menu_lock)
            {
                console.log("menu_locked");
            }else{

                // DOES IT ACTUALLY MAKE ANY SENSE TO MEASURE THIS DYNAMICALLY ?????????????????????????????????????????????????????
                $(".bmenu_root").removeClass("class_hidden");
                var calc_menu_y = cs_y;
                var calc_menu_x = cs_x;

                if (parseInt(cs_x) > ( window.innerWidth - $('.bmenu_root').outerWidth( true ) ) )
                {
                    var calc_menu_x = parseInt(cs_x) - ((parseInt(cs_x) + $('.bmenu_root').outerWidth( true )) - window.innerWidth) - 20;
                    console.log('calc x is ' + calc_menu_x + ' original x is ' + cs_x);
                }

                if (parseInt(cs_y) > ( window.innerHeight - $('.bmenu_root').outerHeight( true ) ) )
                {
                    var calc_menu_y = parseInt(cs_y) - ((parseInt(cs_y) + $('.bmenu_root').outerHeight( true )) - window.innerHeight) -  20;
                    console.log('calc is ' + calc_menu_y + ' original is ' + cs_y);
                }

                 console.log('calc is ' + calc_menu_y + 'original is ' + cs_y);

                $(".bmenu_root")
                    .css({
                    left: calc_menu_x,
                    top: calc_menu_y,
                });

            }

        }

    }

    // Cancel edit on ctrl + q
    if ( zEvent.ctrlKey  &&  zEvent.keyCode == 81)
    {
        console.log("ctrl + q");
        $('.liz3_alt_msg_input').val('');
        $('.im_send_reply_cancel').trigger('mousedown');
        setTimeout( make_input_great_again, 100 );
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


    // Menu entries processor. Thanks to shitty eval() we now don't have to create a new if attr check
    const bmenu_entry = event.target.closest('.bmenu_entry');
    if (bmenu_entry)
    {
        console.log("clicked_on_an_entry");
        eval($(bmenu_entry).attr("bmenu_opt"))()
    }


    // built-in image alter
    const questionable_img = event.target.closest('img');
    if (img_flip_mode)
    {

        if (questionable_img)
        {
            img_flip(questionable_img);
            window.img_flip_mode = false;
            window.menu_lock = false;
            $("img").removeClass("elem_hover");
        }

    }

    const pswd_changer_cancel = event.target.closest('.pswd_editor_btn_cancel');
    if (pswd_changer_cancel)
    {
        $('#global_password_changer').addClass('class_hidden');
        $('#global_password_changer input').val('');
    }


    const pswd_changer_apply = event.target.closest('.pswd_editor_btn_apply');
    if (pswd_changer_apply)
    {
        setCookie('liz3_cur_pswd', CryptoJS.MD5($('#global_password_changer input').val()), 420)
        $('#global_password_changer').addClass('class_hidden');
        $('#global_password_changer input').val('');
    }


    // edit button. Make it copy the message to our shit
    const msg_btn_selective_edit = event.target.closest('.btn.btn-primary.im_edit_reply_btn[ng-click="selectedEdit()"]');
    if (msg_btn_selective_edit)
    {
        setTimeout(() => {
            $('.liz3_alt_msg_input').val($('.tg_original_msg_input').text());
        }, 15);
    }

    const toybox_spammer_conf = event.target.closest('.illuminati_confirm');
    if (toybox_spammer_conf)
    {
        if( $('.illuminati_msg').val().length > 0 && $('.illuminati_int').val().length > 0 && $('.illuminati_count').val().length > 0 && $('.illuminati_info_freq').val().length > 0)
        {
            $('.illuminati_place').addClass('class_hidden');
            super_msg_spammer($('.illuminati_msg').val(), $('.illuminati_int').val(), $('.illuminati_count').val(), $('.illuminati_info_freq').val())
            $('.illuminati_msg').val('lol');
            $('.illuminati_int').val('1');
            $('.illuminati_count').val('10');
            $('.illuminati_info_freq').val('5');
        }else{
            console.log('spammer config invalid!');
        }
    }

    const bmenu_input_autoselect = event.target.closest('.bmenu_row_text_input');
    if (bmenu_input_autoselect)
    {
        $(bmenu_input_autoselect).select();
        $('.mrk_ect_tooltip_box').addClass('class_hidden');
    }

    const bmenu_cancel_illuminati = event.target.closest('.cancel_illuminati');
    if (bmenu_cancel_illuminati)
    {
        $('.illuminati_place').addClass('class_hidden');
        $('.illuminati_msg').val('lol');
        $('.illuminati_int').val('1');
        $('.illuminati_count').val('10');
        $('.illuminati_info_freq').val('5');
    }


});
// hax

document.addEventListener('mouseover', event => {
    // ===========================
    //           Tooltip
    // ===========================
	const cursor_over_tooltip_obj = event.target.closest('*[mrk_ect_tooltip]');
	if (cursor_over_tooltip_obj)
	{
		mrk_ect_timer = setTimeout(function() {
			console.log('delayed call');
			$('.mrk_ect_tooltip_box').css({top: cs_y, left: parseInt(cs_x) - 30 + 'px'});
			$('.mrk_ect_tooltip_box').removeClass('class_hidden');
			$('.mrk_ect_tooltip_box').text($(cursor_over_tooltip_obj).attr('mrk_ect_tooltip'));
		}, mrk_ect_tooltip_timeout);
	}
    // ===========================
    //           Tooltip
    // ===========================
});

document.addEventListener('mouseout', event => {
    // ===========================
    //           Tooltip
    // ===========================
	const cursor_over_tooltip_obj_leave_soon = event.target.closest('*[mrk_ect_tooltip]');
	if (cursor_over_tooltip_obj_leave_soon)
	{
		clearTimeout(mrk_ect_timer);
		$('.mrk_ect_tooltip_box').addClass('class_hidden');
	}
    // ===========================
    //           Tooltip
    // ===========================
});





function action_if_pizza()
{
    glob_hmenu()
    console.log('dominos');
}


function glob_hmenu()
{
    $(".bmenu_root").addClass("class_hidden");
}



function bmenu_imgflip()
{
    glob_hmenu()
    console.log("imgflipped");
    window.img_flip_mode = true;
    window.menu_lock = true;
    $("img").addClass("elem_hover");
}


function decrypt_pswd_changer()
{
    // hide the menu
    glob_hmenu()
    $("#global_password_changer").removeClass('class_hidden');
    $("#global_password_changer")
        .css({
        left: cs_x,
        top: cs_y,
    })
    $("#global_password_changer input").select();

}


function liz3_tg_decrypt_all_msgs()
{
    $('.im_message_text:contains(enc_dat420;)').each(function(){
        $(this).html($(this).html().split('enc_dat420;').join(''));
        console.log("corrected msg is " + $(this).text());
        $(this).text(CryptoJS.AES.decrypt($(this).text(), liz3_current_session_password).toString(CryptoJS.enc.Utf8));
    });

    $('span .im_short_message_text:contains(enc_dat420;)').each(function(){
        $(this).html($(this).html().split('enc_dat420;').join(''));
        console.log("corrected msg is " + $(this).text());
        $(this).text(CryptoJS.AES.decrypt($(this).text(), liz3_current_session_password).toString(CryptoJS.enc.Utf8));
    });
}


function make_input_great_again()
{
    console.log('focus');
    $('.liz3_alt_msg_input').blur();
    $('.liz3_alt_msg_input').focus();
}


// good cookie reference
function enable_liz3()
{
    glob_hmenu()
    checkbox_activator($('.bmenu_entry[bmenu_opt="enable_liz3"] .bmenu_checkbox'), "toggle");
    window.liz3_system_enabled ^= 1;
    liz3_current_config[0] ^= 1;
    setCookie('liz3_config', liz3_current_config.join('-'), 420)
}

function liz3_quick_mute()
{
    glob_hmenu()
    checkbox_activator($('.bmenu_entry[bmenu_opt="liz3_quick_mute"] .bmenu_checkbox'), "toggle");
    window.liz3_quick_mute ^= 1;
    liz3_current_config[1] ^= 1;
    setCookie('liz3_config', liz3_current_config.join('-'), 420)
}

function liz3_dark_theme_menu_call()
{

    if ( window.liz3_dark_mode == 0 )
    {
        $('body').append('<style id="liz3_darkmode_css">@import url("https://dl.dropbox.com/s/tuk1t8ntvn84375/dark.css?dl=0");</style>');
    }else{
        $('#liz3_darkmode_css').remove();
    }
    glob_hmenu()
    window.liz3_dark_mode ^= 1;
    liz3_current_config[2] ^= 1;
    checkbox_activator($('.bmenu_entry[bmenu_opt="liz3_dark_theme_menu_call"] .bmenu_checkbox'), "toggle");
    setCookie('liz3_config', liz3_current_config.join('-'), 420)

}

function liz3_dark_theme_page_load()
{
    if ( window.liz3_dark_mode == 1 )
    {
        $('body').append('<style id="liz3_darkmode_css">@import url("https://dl.dropbox.com/s/tuk1t8ntvn84375/dark.css?dl=0");</style>');
    }
}


function liz3_group_ignore()
{
    glob_hmenu()
    checkbox_activator($('.bmenu_entry[bmenu_opt="liz3_group_ignore"] .bmenu_checkbox'), "toggle");
    window.liz3_group_ignore_var ^= 1;
    liz3_current_config[3] ^= 1;
    setCookie('liz3_config', liz3_current_config.join('-'), 420)
}



function super_msg_spammer(msg, int, count, notify)
{
    /*
    var message = "lolly"; // spam message
    var interval = 0.1  ; // in seconds
    var count = 100 ; // number of times to send
    var notifyInterval = 5 ; // notify
    */
    var message = msg; // spam message
    var interval = int  ; // in seconds
    var count = count ; // number of times to send
    var notifyInterval = notify ; // notify

    var i = 0 ;
    var timer = setInterval(function(){
        document.getElementsByClassName('composer_rich_textarea')[0].innerHTML = message;
        $('.im_submit').trigger('mousedown');
        i++;
        if( i  == count )
            clearInterval(timer);
        if( i % notifyInterval == 0)
            console.log(i + ' MESSAGES SENT');
    } , interval * 1000 ) ;
}


function toybox_msg_spammer()
{
    glob_hmenu()
    $('.illuminati_place').removeClass('class_hidden');


    var calc_menu_y = cs_y;
    var calc_menu_x = cs_x;

    if (parseInt(cs_x) > ( window.innerWidth - $('.illuminati_place').outerWidth( true ) ) )
    {
        var calc_menu_x = parseInt(cs_x) - ((parseInt(cs_x) + $('.illuminati_place').outerWidth( true )) - window.innerWidth) - 20;
        console.log('calc x is ' + calc_menu_x + ' original x is ' + cs_x);
    }

    if (parseInt(cs_y) > ( window.innerHeight - $('.illuminati_place').outerHeight( true ) ) )
    {
        var calc_menu_y = parseInt(cs_y) - ((parseInt(cs_y) + $('.illuminati_place').outerHeight( true )) - window.innerHeight) -  20;
        console.log('calc is ' + calc_menu_y + ' original is ' + cs_y);
    }


    $(".illuminati_place")
        .css({
        left: calc_menu_x,
        top: calc_menu_y,
    });

}


function liz3_decrypt_only()
{
    glob_hmenu()
    checkbox_activator($('.bmenu_entry[bmenu_opt="liz3_decrypt_only"] .bmenu_checkbox'), "toggle");
    window.liz3_decrypt_only_v ^= 1;
    liz3_current_config[4] ^= 1;
    setCookie('liz3_config', liz3_current_config.join('-'), 420)
}



function message_mitm_copier(enc)
{
    if ( parseInt(enc) == 1 )
    {
        var encrypted_beforesend = CryptoJS.AES.encrypt($('.liz3_alt_msg_input').val(), liz3_current_session_password);
        $('.tg_original_msg_input').text('enc_dat420;' + encrypted_beforesend);
    }else{
        $('.tg_original_msg_input').text($('.liz3_alt_msg_input').val());
    }
}
















