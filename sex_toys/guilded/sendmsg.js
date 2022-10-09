var sex = {
	'messageId': 'aaaaaaaa-bbbb-bbbb-bbbb-cccccccccccc' COME UP WITH A MESSAGE ID IN PROVIDED FORMAT,
	'content': {
		'object': 'value',
		'document': {
			'object': 'document',
			'data': {},
			'nodes': [
				{
					'object': 'block',
					'type': 'paragraph',
					'data': {},
					'nodes': [
						{
							'object': 'text',
							'leaves': [
								{
									'object': 'leaf',
									'text': 'sus' THE MESSAGE TEXT ITSELF,
									'marks': []
								}
							]
						}
					]
				}
			]
		}
	},
	'repliesToIds': [],
	'confirmed': false,
	'isSilent': false,
	'isPrivate': false
}

fetch('https://www.guilded.gg/api/channels/aaaaaaaa-bbbb-bbbb-bbbb-cccccccccccc/messages', {
	'headers': {
		'accept': 'application/json, text/javascript, */*; q=0.01',
		'accept-encoding': 'gzip, deflate, br',
		'accept-language': 'en-US,en;q=0.9',
		'content-type': 'application/json',
		'cookie': document.cookie,
		'guilded-client-id': 'aaaaaaaa-bbbb-bbbb-bbbb-cccccccccccc',
		'guilded-stag': 'aaaaaaaa-bbbb-bbbb-bbbb-cccccccccccc',
		'guilded-viewer-platform': 'desktop',
		'origin': 'https://www.guilded.gg',
		'referer': 'https://www.guilded.gg/chat/aaaaaaaa-bbbb-bbbb-bbbb-cccccccccccc',
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'

	},
	'referrer': 'https://www.guilded.gg/chat/aaaaaaaa-bbbb-bbbb-bbbb-cccccccccccc',
	'referrerPolicy': 'strict-origin-when-cross-origin',
	'body': JSON.stringify(sex),
	'method': 'POST',
	'mode': 'cors',
	'credentials': 'include'
})
.then(function(response) {
	// console.log(response.status);
	response.text().then(function(data) {
		console.log(data)
	});
});