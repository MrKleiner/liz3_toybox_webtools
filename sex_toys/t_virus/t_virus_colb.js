window.global_lock = 0;

function gen_complex()
{
	$('.status').text('')
	$('.state *').remove('')
	$('.status').append('<br>initialized...');
	
	
	var rndwave_biopas = liz3_rndwave(32);
	$('.status').append('<br>Created biopas: ' + rndwave_biopas);
	
	var rndwave_megapas = liz3_rndwave(32);
	$('.status').append('<br>Created megapas: ' + rndwave_megapas);
	
	var rndwave_biolog = liz3_rndwave(32).toLowerCase();
	$('.status').append('<br>Created bilolog: ' + rndwave_biolog);
	// ac_dc_generator(rnd_login.toLowerCase(), rnd_pswd);
	// console.log('in gen complex login is ' + rnd_login.toLowerCase())
	
	ac_dc_generator(rndwave_biolog, rndwave_biopas, rndwave_megapas)
}


function ac_dc_generator(biolog, biopas, megapas)
{
	let fuck = new Mailjs();
	
	$('.status').append('<br>Getting domain');
	fuck.getDomains().then((value) => {
		console.log(value);
		$('.status').append('<br>Got domain: ' + value['data'][0]['domain']);
		gen_account(biolog, biopas, megapas, value['data'][0]['domain']);

	});
	
	
	function gen_account(genac_biolog, genac_biopas, genac_megapas, genac_domain)
	{
		console.log(genac_biolog + '@' + genac_domain);
		$('.status').append('<br>Generating account');
		fuck.register(genac_biolog + '@' + genac_domain, genac_biopas).then((value) => {
			$('.status').append('<br>Generated account');
			console.log(value);
			window.cur_domain = genac_domain;
			mredirect(genac_biolog + '@' + genac_domain, genac_biopas, genac_megapas)
		});
	}
	
	function mredirect(tr_biolog, tr_biopas, tr_megapas)
	{
		$('.status').append('<br>Email: ' + tr_biolog);
		window.cur_login = tr_biolog;
		$('.status').append('<br>Passw: ' + tr_biopas);
		window.cur_pswd = tr_biopas;
		
		var mfirst_nen = liz3_rndwave(16);
		$('.status').append('<br>Generated first name: ' + mfirst_nen);
		
		var mlast_nen = liz3_rndwave(16);
		$('.status').append('<br>Generated last name: ' + mlast_nen);
		
		
		
		// first name
		// last name
		// email
		// megapas
		// biopas
		var gjeson = 
		`
		[
			{
				"mfirst_nen": "` + mfirst_nen + `",
				"mlast_nen": "` + mlast_nen + `",
				"email": "` + tr_biolog + `",
				"megapas": "` + tr_megapas + `",
				"biopas": "` + tr_biopas + `"
			}
		]
		`;
		console.log(gjeson)
		var enc_dat = btoa(gjeson);
		
		window.open('https://mega.nz/register?l3command=reg_acc&rc_data=' + enc_dat, '_blank');
		l3_get_shit(tr_biolog, tr_biopas)
	}
}


function l3_get_shit(gbiolog, gbiopswd, findhead)
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
			/*
			window.bottle = 'ded';
			window.bottle = get_wrench(getObjects(value,'subject','MEGA Email Verification Required')[0]['id']);
            console.log('Found verification message id: ' + getObjects(value,'subject','MEGA Email Verification Required')[0]['id']);
            get_wrench(getObjects(value,'subject','MEGA Email Verification Required')[0]['id']);
			*/
			// Welcome to MEGA
			// 'MEGA Email Verification Required'
			var bottle = getObjects(value, 'subject', 'MEGA Email Verification Required');
			console.log(getObjects(value, 'subject', 'MEGA Email Verification Required'));
			console.log(bottle);
			if (bottle.length == 0)
				{
					console.log('havent found the required header. trying again in 1 sec');
					setTimeout(function() {
						if (window.global_lock == 0)
						{
							l3_get_shit(gbiolog, gbiopswd);
						}
					}, 1500)
				}else{
					console.log('bottle is probably nice and is ');
					console.log(bottle);
					get_wrench(getObjects(value,'subject', 'MEGA Email Verification Required')[0]['id']);
				}
            
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