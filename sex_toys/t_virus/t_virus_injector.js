// ==UserScript==
// @name         mgh site parse
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  It costs 400 000 dollars to fire this weapon for 12 seconds
// @author       Heavy Weapons Guy
// @match        https://mega.nz/*
// @match        https://mega.io/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdn.jsdelivr.net/gh/MrKleiner/liz3_toybox_webtools@latest/sex_toys/shared/toolbox.js
// @require      https://cdn.jsdelivr.net/gh/cemalgnlts/Mailjs/Mailjs.min.js
// @grant        none
// ==/UserScript==



// .clone(true) to solve all world problems
// window.location.search
// first of all - let's take the page url with any possible parameters
window.con_command = window.location.href;
console.log(window.location.href)

window.liz3_url_comms = new URLSearchParams(window.location.search);

// now, just for consistency - wait for document ready state
$(document).ready(function(){

    // declare the super input field
    window.super_new_page =
    `
    <div id="auto_login_input_container">
		<input type="password" id="super_auto_login_input"></input>
		<p>Shift + q to logout. Shift + F for storage info</p>
    </div>
    `;

    // define css for login page
    window.logpage_css =
    `
    body
    {
        display: flex !important;
        background: #1e1e1e !important;
        align-items: center;
        justify-content: center;
    }

    #login_form
    {
        background: rgba(255, 255, 255, 0.1);
        color: white !important;
    }

    #login_form *
    {
        color: white !important;
    }
    `;

    // Apparently, the page we're looking for doesnt exist til some filthy javascripts spawn all the required elements (the whole fking page, basically. Therefore, it takes some time)
    // Mutation observer won't save ya ugly ass.
    // Engage sex toys: spam wait 'till we find our shit.

    // Many problems arise from that really.
    // Each section on mega is carefully named:
    /*

    /start - main page with login shit
    /fm - Account. When logged in
    /register - create account
    /login - login page
    */

    // liz3_mviewfinder('section.topbar.top-head.js-topbar', 'create_liz3_input', 50);
    // liz3_mviewfinder('#register_form', 'check_for_register_info', 51);

    // Here we will decide what to do and what to expect based on where we are. Yes, Tampermokey provies such functionality, but no, fuck you.
    // First, lets settle the start page stuff.

    // if (window.liz3_url_comms.has("l3command"))

    // Split the page address. The location will always be the third elem. Then feed it into the switch
    if (con_command.split('/')[3].split('?')[0].includes('confirm'))
    {
        // location.href = "https://mega.nz/login";
        console.log('includes confirm')
        liz3_mviewfinder('#login-name2', 'confirm_fixup', 50);

    }

    // split the webpage path and do shit according to the path
    switch (con_command.split('/')[3].split('?')[0]) {

        case 'login':
            location_login()
            console.log('location = login');
            break;
        case 'register':
            liz3_mviewfinder('#register_form #register-password-registerpage3', 'check_for_register_info', 50);
            console.log('location = register');
            break;
        case 'pro':
            // window.location.href = "https://mega.nz/fm";
            // alert('location is pro');
            // window.location.href = "https://mega.nz/fm";
            setTimeout(function() {
                window.location.href = "https://mega.nz/fm/account?l3command=close_fuckshit_dark_shit";
                // alert('delayed call');
                // liz3_mviewfinder('#pro-yearly-payment', 'login_pro_fixup', 50);
                // self.close();

            }, 7500)
            console.log('location = pro');
            break;
        case 'fm':
            console.log('were at fm so that could be anything really. Check for further paths');


            // Check if we actually have the extended path
            /*
               for example: https://mega.nz/fm/account
            */
            //
            //
            // if extended path exists - proceed to switches START
            if (typeof window.con_command.split('/')[4] != 'undefined')
            {
                // another switch for fm paths START
                switch (con_command.split('/')[4].split('?')[0]) {

                        // This is only needed for the first-time activation, when we set the dark theme.
                        // I guess more cases would come.
                    case 'account':
                        console.log('were at account. check for commands');
                        location_account()
                        break;

                    default:
                        // just notify the user that we dont do shit
                        console.log('net err 173');
                        break;
                }
                // another switch for fm paths END
            }
            // if extended path exists - proceed to switches END
            //
            //

            break;
        default:
            // this will happen if we're at some randomass location, like some bs chat or smth
            console.log('so were most likely at smth like mega.nz. Well... Shit...');
            break;
    }


});


function location_login()
{
    // Create temp elem for holding the login form. Doesnt matter when we do this really
    $('body').append('<div class="l3_tmp_holder"></div>');
    // wait for login form to load, move it to tmp container and then delete everything
    liz3_mviewfinder('#login_form .account.checkbox-block.left', 'loc_start_cleanup_func_st2', 50);
    window.loc_start_cleanup_func_st2 = function loc_start_cleanup_st2()
    {
        $('body').append('<style>' + window.logpage_css + '</style>');
        console.log('we got to stage 2');
        $('#login_form').appendTo('.l3_tmp_holder');
        $('#startholder').remove();
        $('#login_form .account.dialog-dark-bottom.register').remove();
        $('#login_form .login-page-forgot-bl').remove();
        $('#login_form').append('<div class="finished_form"></div>');


        // We never want to stay logged in. Check if the cbox is set and turn it off
        if ($('.account.checkbox-block.left .login-check.checkbox').hasClass('checkboxOn'))
        {
            document.querySelector('.login-check.checkbox.checkboxOn').click()
        }
    }

}

function confirm_fixup()
{

    setTimeout(function() {
        window.location.href = "https://mega.nz/pro";
        // alert('delayed call');
        // liz3_mviewfinder('#pro-yearly-payment', 'login_pro_fixup', 50);
        // self.close();

    }, 1500)

}

function login_pro_fixup()
{
    //alert('found biz');
    console.log('found biz radio')
    // window.location.href = "https://mega.nz/fm";
    // liz3_mviewfinder('#pro-yearly-payment', 'confirm_fixup', 50);
}

function check_for_register_info()
{

    // check if the command we've recieved is really about registering and has any l3 commands at all
    // if commands detected - try to read them
    // if shit's malformed - everyone's gonna die
    // The reason this is not a switch is because we're at register alr. There could be no other parameters.
    // Thankfully, this will return false if no l3command is presented.
    console.log(window.liz3_url_comms.get("l3command"))
    if (window.liz3_url_comms.get("l3command") === 'reg_acc')
    {

        // if so - decode parameters into json
        // params are passed via rc_data
        var comm_decode = atob(window.liz3_url_comms.get("rc_data"));

        var param_json = JSON.parse(comm_decode)[0];
        // first name
        $('#register-firstname-registerpage2').val(param_json.mfirst_nen);

        // last name
        $('#register-lastname-registerpage2').val(param_json.mlast_nen);

        // email
        $('#register-email-registerpage2').val(param_json.email);

        // password
        $('#register-password-registerpage2').val(param_json.megapas);

        // repeat pswd
        $('#register-password-registerpage3').val(param_json.megapas);

        // cbox 1
        $('.checkbox-block .understand-check *').click();

        // cbox 2
        $('.account .register-check *').click();

        liz3_mviewfinder('.mega-dialog.dialog-template-graphic.registration-success.registration-page-success.special .reg-success-special', 'global_close_self', 50);
        // register !
        $('.mega-button.branded-red.large.register-button.right.active').click();

        // close the tab we dont need it
        setTimeout(function() {
            // window.location.href = "https://mega.nz/fm";
            // alert('3 sec delay');
            // self.close();
            // liz3_mviewfinder('#pro-yearly-payment', 'login_pro_fixup', 50);
        }, 1500)



    }

}

function global_close_self()
{
    // alert('close self')
    self.close();
}

function location_account()
{

    // check for commands
    if (window.con_command.includes('l3command'))
    {
        console.log('we include some commands')
        // check if command has more data to it
        if (window.con_command.includes('&'))
        {
            console.log('we include &');
            console.log(window.con_command.split('/')[4].split('?')[1].split('=')[1]);
            // if not - assume it's a simple single command
        }else{
            console.log('we do not include &');
            console.log(window.con_command.split('/')[4].split('?')[1].split('=')[1]);

            if (window.con_command.split('/')[4].split('?')[1].split('=')[1] == 'close_fuckshit_dark_shit')
            {
                liz3_mviewfinder('.mega-dialog.dialog-template-tool.revamp-onboarding .content', 'close_dark_mode_proposal', 50);
            }

        }

        /*
        switch (con_command.split('/')[4].split('?')[0]) {

            case 'account':
                console.log('were at account. check for commands');
                location_account()
                break;
            default:
                console.log('net err 173');
                break;
        }
        */
    }

}

function close_dark_mode_proposal()
{
    setTimeout(function() {
        document.querySelector('.mega-dialog.dialog-template-tool.revamp-onboarding header *').click();
        document.querySelector('#themedark_div *').click();
        document.querySelector('.nw-fm-left-icon.cloud-drive.sprite-fm-uni-before.icon-files-before.js-fm-tab.ui-droppable *').click();

    }, 1500)

}

function l3_get_shit(gbiolog, gbiopswd)
{
    // $('.state *').remove()
    let fuck = new Mailjs();
    fuck.login(gbiolog, gbiopswd).then((value) => {
        console.log(value);
        get_shark()
        // window.ptest = value;
    });

    function get_shark()
    {
        fuck.getMessages().then((value) => {
            console.log(value['data']);
            window.elist_s = value;
            console.log(value);
            // window.ptest = value;
            // get_wrench(value['data'])

            console.log('Found verification message id: ' + getObjects(value,'subject','MEGA Email Verification Required')[0]['id']);
            get_wrench(getObjects(value,'subject','MEGA Email Verification Required')[0]['id']);
        });
    }

    function get_wrench(msgid)
    {
        fuck.getMessage(msgid).then((value) => {
            console.log(value['data']['html'][0]);
            // window.ptest = value;
            var hexen = $.parseHTML(value['data']['html'][0])
            console.log(hexen)
            $('.state').append(hexen)
            console.log($(hexen).find('#bottom-button').text())
            window.open($(hexen).find('#bottom-button').attr('href'), '_blank');
        });

    }

}



function create_liz3_input()
{
    $(".top-head").append(super_new_page);
    console.log('created_input')
    // 3 Seconds. Take it or leave it. If your PC is not fast enough to boot the page in 3 seconds - go fuck yourself with your crap PC from 2001. Go buy some decent shit, you peasant.
}



// ==================================================================
//
// Now, define some useful shit
//
// ==================================================================

//
// This bs copies the link of an item
//
function super_link_c()
{
    var what_to_copy = $(".item-link input").attr("value");
    console.log(what_to_copy)
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(what_to_copy).select();
    document.execCommand("copy");
    $temp.remove();

}

/*
//
// This piece of fucking crap splits your weak bs login info taken from our super cool password input and logs you into your pathetic account filled with reptile porn.
//
function artificial_shit()
{
    // Login Menu does not fucking exist when it's not visible, because fuck you. Click it to make it exist. Fuck
    $(".default-white-button.small.dark-border.top-login-button").click();

    // Split input data. And fill login inputs
    $("#login-name").val($("#super_auto_login_input").val().split(",")[0]);
    $("#login-password").val($("#super_auto_login_input").val().split(",")[1]);

    // Log our success and celebrate it like NASA engineers celebrate it when their shit works on Mars
    console.log("triggered");

    // click the login button to basically login into an account
    $(".big-red-button.height-32.top-dialog-login-button.button.right").click();
}


*/


