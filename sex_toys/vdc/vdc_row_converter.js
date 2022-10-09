// ==UserScript==
// @name         vdc pre code block converter
// @namespace    http://tampermonkey.net/
// @version      1.27
// @description  Convert solid <pre> blocks on Valve Developer Community into nice rows.
// @author       MrKleiner
// @require      https://raw.githubusercontent.com/MrKleiner/liz3_toybox_webtools/main/sex_toys/shared/toolbox.js
// @match        https://developer.valvesoftware.com/wiki/*
// @icon         https://www.google.com/s2/favicons?domain=valvesoftware.com
// @grant        none
// @run-at       document-end
// ==/UserScript==



window.sternennacht = function()
{
	document.body.append(lizard.ehtml(`
		<style>
			.liz3_vdc_line:hover
			{
				background: linear-gradient(0deg,rgba(0,0,0,.08) 0,rgba(0,0,0,.08) 100%);
			};
		</style>
	`.replaceAll('\n', '')));

	// go through every <pre> block
	for (var pre of document.querySelectorAll('.mw-parser-output pre')){
		// The content of every pre block is simply a bunch of text with line breaks
		// Split this text at line breaks and for every resulting entry
		// append this line as an html element
		// obviously, clearing the insides of the <pre> block prior to that
		const entries = pre.innerText.split('\n');
		pre.innerHTML = '';
		for (var sex of entries){
			pre.append(lizard.ehtml(`<div class="liz3_vdc_line">${sex}</div>`));
		}
	}
}


var bdsm = lizard.wait_elem('#p-tb ul');

bdsm.wait()
.then(function(response) {
	document.querySelector('#p-tb ul').append(lizard.ehtml(`
		<li><a onclick="this.remove();window.sternennacht()" id="call_pre_converter">Convert pre blocks</a></li>
	`));
});


