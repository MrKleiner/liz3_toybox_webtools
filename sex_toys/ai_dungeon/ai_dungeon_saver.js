document.addEventListener('keydown', kvt => {
    console.log('keypress');

    if (  kvt.altKey  &&  kvt.keyCode == 83  )
    {
        console.log('exec saveer')
        saver_solution()
    }
});


function saver_solution()
{
    function _arrayBufferToBase64( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }

    window.fontz = [];

    window.liz3_url_comms = new URLSearchParams(window.location.search);
    console.log(window.liz3_url_comms.get('publicId'))

    function gft(ur, nt)
    {
        // If you are loading file from a remote server, be sure to configure “Access-Control-Allow-Origin”
        // For example, the following image can be loaded from anywhere
        var url = ur;

        // Initialize the XMLHttpRequest and wait until file is loaded
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            // Create a Uint8Array from ArrayBuffer
            var codes = new Uint8Array(xhr.response);
            // Get binary string from UTF-16 code units
            var bin = _arrayBufferToBase64(codes)
            // Convert binary to Base64
            // var b64 = btoa(bin);
            // console.log(b64); //-> "R0lGODdhAQABAPAAAP8AAAAAACwAAAAAAQABAAACAkQBADs="
            // console.log(bin)
            window.fontz[nt] = 'url(data:font/ttf;base64,' + bin + ')'
            try {
                if ( window.fontz['community'].length > 1 ){
                    fuckjs()
                }
            } catch (error) {
                console.log('ddddd');
                // expected output: ReferenceError: nonExistentFunction is not defined
                // Note - error messages will vary depending on browser
            }
        };
        // Send HTTP request and fetch file as ArrayBuffer
        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        xhr.send();
    }

    gft('https://play.aidungeon.io/static/media/FontAwesome.b06871f2.ttf', 'awesome')
    gft('https://play.aidungeon.io/static/media/MaterialCommunityIcons.6a2ddad1.ttf', 'community')

    // rip html
    function liz3_text_dl(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();

        document.body.removeChild(element);
    }


    function fuckjs()
    {
        // var elHtml_crypt = document.querySelector('#root').innerHTML;
        var fuckshit = `<!DOCTYPE html>
    <html>
	<script type="text/javascript">
		function fuf()
		{
			var fuckoff = document.querySelectorAll('div[aria-label="action icon"]')
			for (var pussy in fuckoff){
				try {
				  fuckoff[pussy].innerText = fuckoff[pussy].innerText.replace('ó°œŽ', '󰜎')
				} catch (error) {
				  console.log('nen');
				}
				// console.log(fuckoff[pussy].innerText)
			}
            document.querySelector('div[aria-label="Sidebar menu"]').remove()
		}
		fuf()
	</script>

    <body onload="fuf()">
    <style type="text/css">

    @font-face {
      font-family: 'MaterialCommunityIcons';
      src: ` + window.fontz['community'] + ` format('truetype');
    }
    @font-face {
      font-family: 'FontAwesome';
      src: ` + window.fontz['awesome'] + ` format('truetype');
    }

    div{
        flex-direction: column;
    }

    *
    {
        margin: 0px;
        padding: 0px;
    }
    body, html
    {

        background: #121212;
    }

    .css-1dbjc4n.r-16y2uox > div
    {
        display: flex;
        flex-direction: row;
    }
    .css-1dbjc4n.r-16y2uox
    {
        margin-bottom: 200px;
    }
    </style>
    <div style="color: gray;">` + window.liz3_url_comms.get('publicId') + `</div>
    ` +
            document.querySelector('.css-1dbjc4n.r-16y2uox').innerHTML.replaceAll('@font-face', '@font-facesdsdsdsd').replaceAll('ó°œŽ', 'NAN')
        +
            `
    </body>
    </html>
    `;
        var today = new Date();
        var data = today.getDate() + '_' + (today.getMonth()+1) + '_' + today.getFullYear() + '_t_' + today.getHours() + '_' + today.getMinutes() + '_' + today.getSeconds();
        liz3_text_dl(data + '.html', fuckshit)
    }
}