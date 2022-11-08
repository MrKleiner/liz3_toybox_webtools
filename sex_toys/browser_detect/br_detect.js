

//
// Browser detect thingy
//

// This does not fall under the cencept of fingerprinting for now,
// this simply gives a possibility to know what kind of browser engine is present

// No OS detection for now

// It's very important to note that the best efficiency
// and accuracy is achieved when window.isSecureContext is true

// This does not take the user agent into account AT ALL
// Because it's literally the first and the main thing browsers tryna obfuscate

const browser_detector = {

	// just so that it looks a little nicer
	exec: function(){
		// create the score board
		const haxtable = this.compat_table()

		// go through each entry
		var candidates = {
			'chrome': 0,
			'firefox': 0,
			'safari': 0
		}
		// test each system and score browsers
		for (let sys in haxtable){
			// https condition
			if (haxtable[sys].https == true && !window.isSecureContext){continue}

			var discovered = haxtable[sys].special ? haxtable[sys]['special']() : this.obj_walk(window, sys, !!haxtable[sys].last)
			// go trough every browser
			for (let browser in haxtable[sys]['browsers']){
				// check whether declared compat matches discovered
				// only collect mismatches
				candidates[browser] += (haxtable[sys]['browsers'][browser] != discovered) ? 1 : 0
			}
		}

		// store it, because why not
		this.scoreboard = candidates

		// flip keys and objects in the candidates dict
		var candidate_score = {}
		const c_keys = Object.keys(candidates)
		const c_vals = Object.values(candidates)
		for (let kp_index in c_keys){
			candidate_score[c_vals[kp_index]] = c_keys[kp_index]
		}

		// store it, because why not
		this.scoreboard_flipped = candidate_score

		// also store the winner
		const winner = candidate_score[Math.min(...Object.keys(candidate_score))]
		this.winner = winner
		return winner
	},

	// basically the main process
	compat_table: function(){
		const cp_table = {
			'chrome': {
				'yes': [
					window.isSecureContext ? !!window.FileSystemHandle : true,
					!!window.ImageCapture,
					window.isSecureContext ? !!window.navigator.locks.request : true,
					window.isSecureContext ? !!window.showOpenFilePicker : true,
					!!window.navigator.share,
					window.isSecureContext ? ((!!window.PushManager.prototype) ? !!window.PushManager.prototype.getSubscription : false) : true,
					!!window.URL,
					('outputLatency' in (new window.AudioContext)),
					('backdropFilter' in document.body.style),
					!!window.VideoFrame,
					!!window.VideoEncoder
				],
				'no': [
					!window.AudioContext.prototype.createMediaStreamTrackSource
				]
			},
			'firefox': {
				'yes': [
					!!window.AudioContext.prototype.createMediaStreamTrackSource,
					window.isSecureContext ? !!window.navigator.locks.request : true,
					window.isSecureContext ? ((!!window.PushManager.prototype) ? !!window.PushManager.prototype.getSubscription : false) : true,
					!!window.URL,
					('outputLatency' in (new window.AudioContext))
				],
				'no': [
					!window.FileSystemHandle,
					!window.ImageCapture,
					!window.navigator.share,
					!('backdropFilter' in document.body.style),
					!window.VideoFrame,
					!window.VideoEncoder,
					window.isSecureContext ? !window.showOpenFilePicker : true,
				]
			},
			'safari': {
				'yes': [
					!!window.FileSystemHandle,
					window.isSecureContext ? !!window.navigator.locks.request : true,
					window.isSecureContext ? ((!!window.PushManager.prototype) ? !!window.PushManager.prototype.getSubscription : false) : true,
					!!window.navigator.share
				],
				'no': [
					(window.FileSystemHandle) ? !window.FileSystemHandle.prototype.queryPermission : true,
					(window.FileSystemHandle) ? !window.FileSystemHandle.prototype.requestPermission : true,
					!window.ImageCapture,
					!window.AudioContext.prototype.createMediaStreamTrackSource,
					!('outputLatency' in (new window.AudioContext)),
					!('backdropFilter' in document.body.style),
					!window.VideoFrame,
					!window.VideoEncoder,
					window.isSecureContext ? !window.showOpenFilePicker : true,
				]
			}
		}

		const alt_table = {
			'FileSystemHandle': {
				'browsers': {
					'chrome': true,
					'firefox': false,
					'safari': true
				},
				'https': true
			},
			'ImageCapture': {
				'browsers': {
					'chrome': true,
					'firefox': false,
					'safari': false
				}
			},
			'navigator.locks.request': {
				'browsers': {
					'chrome': true,
					'firefox': true,
					'safari': true
				},
				'https': true
			},
			'showOpenFilePicker': {
				'browsers': {
					'chrome': true,
					'firefox': false,
					'safari': false
				},
				'https': true
			},
			'navigator.share': {
				'browsers': {
					'chrome': true,
					'firefox': false,
					'safari': true
				},
				'https': true
			},
			'PushManager.prototype.getSubscription': {
				'browsers': {
					'chrome': true,
					'firefox': true,
					'safari': true
				},
				'https': true
			},
			'AudioContext.prototype.outputLatency': {
				'browsers': {
					'chrome': true,
					'firefox': false,
					'safari': false
				},
				// last = should only be checked for presence and not execution
				'last': true
			},
			'AudioContext.prototype.createMediaStreamTrackSource': {
				'browsers': {
					'chrome': false,
					'firefox': true,
					'safari': false
				},
				// last = should only be checked for presence and not execution
				'last': true
			},
			'document.body.style.backdropFilter': {
				'browsers': {
					'chrome': true,
					'firefox': false,
					'safari': false
				}
			},
			'VideoFrame': {
				'browsers': {
					'chrome': true,
					'firefox': false,
					'safari': false
				}
			},
			'VideoEncoder': {
				'browsers': {
					'chrome': true,
					'firefox': false,
					'safari': false
				}
			},
			'FileSystemHandle.prototype.queryPermission': {
				'browsers': {
					'chrome': true,
					'firefox': false,
					'safari': false
				},
				'https': true
			},
			'FileSystemHandle.prototype.requestPermission': {
				'browsers': {
					'chrome': true,
					'firefox': false,
					'safari': false
				},
				'https': true
			},
			'FileSystemHandle.prototype.isSameEntry': {
				'browsers': {
					'chrome': true,
					'firefox': false,
					'safari': true
				},
				'https': true
			},
			'mozcss': {
				'browsers': {
					'chrome': false,
					'firefox': true,
					'safari': false
				},
				'special': this.moz_tgt_css
			}
		}

		return alt_table
	},

	// walk object path
	obj_walk: function(ob, tgt, dolast=false, give_func=false){
		var current = ob
		const ob_path = tgt.split('.')
		for (let fpath of ob_path) {
			if (fpath in current){
				if (fpath == ob_path.at(-1) && dolast){break}
				current = current[fpath]
			}else{
				return false
			}
		}
	    return (give_func ? current : true)
	},

	// check css targeting
	moz_tgt_css: function(){
		const hax = `
			@-moz-document url-prefix() {
				#mega_hax_8Sjdawg {
					display: flex !important;
					position: fixed !important;
					opacity: 0 !important;
					pointer-events: none !important;
					width: 25px !important;
					height: 27px !important;
					background: #000000 !important;
				}
			}
		`;
		const haxcss = document.createElement('style');
		const identifier = 'iwillfuckingdetectyourbrowser'
		haxcss.id = identifier
		haxcss.textContent = hax
		document.body.append(haxcss)
		const hax_elem = document.createElement('div');
		hax_elem.id = 'mega_hax_8Sjdawg'
		document.body.append(hax_elem)
		const applied = getComputedStyle(document.querySelector('#mega_hax_8Sjdawg'))
		if (applied.width == '25px' && applied.height == '27px'){
			return true
		}else{
			return false
		}
        document.querySelector(`#${identifier}`).remove()
        document.querySelector(`#mega_hax_8Sjdawg`).remove()
	}
}

browser_detector.exec()

