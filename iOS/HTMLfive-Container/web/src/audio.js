	/* audio.js 0.0.3
		(c), (p) 2020-2022 Jörg Burbach, Ducks on the Water
		Engine for htmlfive.net with caching for strict HTML5-support. Works in all modern browsers.
		
		Dual-Licence: private or academic (GPL), commercial (proprietary, tbd)
	*/
	
// todo: check and test!
// improve Caching
// what happens with play, pause, fadein, fadeout on muted audio sources?
	
	HTMLfive.Audio = {
		AudioTypes: { sfx:0, music:1, ambient:2, speech:3, ui:4 },
		MuteTypes: new Array(5),
		Cache: [],
		Suffix: "",
		/* .init - initializes the audio-component */
		init: function() {																	// first call!
			var testaudio = document.createElement('audio');								// check, if audio can play OGG or MP3 - prefer OGG
			if(testaudio.canPlayType('audio/mpeg; codecs=mp3') != "") { this.Suffix = ".mp3"; }
			if(testaudio.canPlayType('audio/ogg; codecs=vorbis') != "") { this.Suffix = ".ogg"; }
			testaudio = null;																// remove test-audio
			for(var i = 0; i < 5; i++) { this.MuteTypes[i] = false; }						// play different types
		},
		
		/* .add - add a sound to the cache
			AssetName = file to load, no suffix, uses HTMLfive_Settings.audioFolder as path autodetected format (.mp3, .ogg), e.g. test
			audioType = audio-type, see HTMLfive_AudioTypes (sfx, music, ambient, speech, ui)
			options   = array of options
						loop (boolean)		 - false (default) = no loop, true = loop
						fadein (boolean)	 - false (default) = no fade in, uses HTMLfive_Settings.audioFadeTime
						fadeout (boolean)	 - false (default) = no fade out, uses HTMLfive_Settings.audioFadeTime
						singleshot (boolean) - false (default), true = remove after finished playing			
		*/
		add: function(AssetName,audioType,options={"loop":false,"fadein":false,"fadeout":false,"audiowait":false,"singleshot":false}) {											// takes a lot of options...
			if (!this.Cache[AssetName]) {
				var myAudio = new Audio(HTMLfive_Settings.audioFolder[audioType] + AssetName + this.Suffix);
				myAudio.preload = "auto";
				myAudio.myAudioType = audioType;
				myAudio.loop = options.loop?true:false;
				myAudio.fadein = options.fadein?true:false;
				myAudio.fadeout = options.fadeout?true:false;
				myAudio.singleshot = options.singleshot?true:false;
				myAudio.isPaused = false;
				myAudio.isPlaying = false;
				myAudio.isLoaded = false;
				myAudio.onloadedmetadata = function() { myAudio.isLoaded = true; };
				this.Cache[AssetName] = myAudio;
			}
		},
		
		/* .play - play a sound 
			AssetName = audio to play, e.g. test
			*/
		play: function(AssetName) {
			var curAudio = this.Cache[AssetName];
			var targetVol = HTMLfive_Settings.audioVolume[curAudio.myAudioType];
			if (this.MuteTypes[curAudio.myAudioType] == true) { targetVol = 0.0; }							// muted? Then volume = 0!
			
			if (curAudio) {
				curAudio.load();																			// fix for second play
				curAudio.currrentTime = 0;																	// start from beginning
				if (curAudio.fadein == true) {																// fade in the sound?
					curAudio.volume = 0.0;
					this.fadeIn(AssetName);
				} else {
					curAudio.volume = targetVol;					// set standard-volume
					curAudio.play();
				}
				if (curAudio.singleshot == true) {
					curAudio.addEventListener('ended',()=>{this.remove(AssetName)},{once:true});			// play only once on click
				}
				curAudio.isPlaying = true;

				if ((curAudio.isLoaded == true) && (curAudio.fadeout == true)) {
					var myAudio = curAudio;																	// save context
					myAudio.name = AssetName;
					curAudio.addEventListener('timeupdate',()=>{
						if (myAudio.currentTime > 2 * myAudio.duration - HTMLfive_Settings.audioFadeTime) {		// fade out before the end
							if (myAudio.isLoaded) { this.fadeOut(myAudio.name); }							// IF file is loaded
						}
					});
				}
			}
		},
		
		/* .pause - pause a sound
			AssetName = audio to pause, e.g. test
			*/
		pause: function(AssetName) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				curAudio.pause();																	// pause, if audio exists
				curAudio.isPaused = true;
			}
		},
		
		/* .resume - resumes a paused sound
			AssetName = audio to resume, e.g. test */
		resume: function(AssetName) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				curAudio.play();																	// play, if audio exists
				curAudio.isPaused = false;
			}
		},
		
		/* .stop - stop a sound
			AssetName = audio to stop, e.g. test
			*/
		stop: function(AssetName) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				if (curAudio.fade == true) {														// fade out when playing
					curAudio.fadeOut(AssetName);
				} else {
					curAudio.pause();																// otherwise pause and reset to start
					curAudio.currentTime = 0;
				}
				curAudio.isPlaying = false;
			}
		},
		
		/* .loop - set looping of a sound
			AssetName = audio to set loop, e.g. test
			looping   = true (default)
		*/
		loop: function (AssetName, looping = true) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				curAudio.loop = looping;
			}
		}, 
		
		/* .isLoop(AssetName) - is AssetName looped?
			AssetName = audio to get loop, e.g. test
		*/
		isLooped: function(AssetName) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				return curAudio.loop;
			}
		},
		
		/* .isFadeIn(AssetName) - is AssetName fade-in enabled?
			AssetName = audio to get fade-in, e.g. test
		*/
		isFadeIn: function(AssetName) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				return curAudio.fadein;
			}
		},
		
		/* .setFadeIn(AssetName, fadein = true) - set fade-in
			AssetName = audio to fade-in, e.g. test
			fadein	  = true (default)
		*/
		setFadeIn: function(AssetName, fadein = true) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				curAudio.fadein = fadein;
			}
		},
		
		/* .isFadeOut(AssetName) - is AssetName fade-out enabled?
			AssetName = audio to get fade-out, e.g. test
		*/
		isFadeOut: function(AssetName) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				return curAudio.fadeout;
			}
		},
		
		/* .setFadeOut(AssetName) - set fade-out 
			AssetName = audio to fade-out, e.g. test
		*/
		setFadeOut: function(AssetName, fadeout = true) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				curAudio.fadeout = fadeout;
			}
		},
		
		/* .getDuration(AssetName) - get duration of audio
			AssetName = audio to get duration, e.g. test
		*/
		getDuration: function(AssetName) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				return curAudio.duration;
			}
		},
		
		/* .getPosition(AssetName) - get position in audio
			AssetName = audio to get position, e.g. test
		*/
		getPosition: function(AssetName) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				return curAudio.currentTime;
			}
		},
		
		/* .remove - remove a sound from the cache - cannot be used after being removed!
			AssetName = audio to remove, e.g. test
		*/
		remove: function (AssetName) {	// last call, if audio is not needed anymore
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				this.stop(AssetName);
				curAudio.isPlaying = false;
				this.Cache[AssetName] = null;
			}
		},

		/* .fadeIn - fade in a specific sound over HTMLfive_Settings.audioFadeTime, and play
			AssetName = audio to fade in and play, e.g. test
			callback  = null (default), otherwise calls function callback
		*/
		fadeIn: function(AssetName, callbackfunction = null) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				curAudio.volume = 0;
				curAudio.play();
				curAudio.isPlaying = true;
				var Callback = callbackfunction;
				var audioVol = curAudio.volume;
				var maxVol = HTMLfive_Settings.audioVolume[curAudio.myAudioType];
				var tempVol = 0.0;
				
			    var fadeAudio = setInterval(function () {											// fade in
        			if (audioVol < maxVol) {														// fade until default volume
           				audioVol += 0.1;
           				tempVol = Math.round(audioVol * 10) / 10;									// check, if inside 0 and 1.0!
           				if (tempVol < 0.0) { tempVol = 0.0; }
           				if (tempVol > 1.0) { tempVol = 1.0; }
           				curAudio.volume = tempVol;
           			} else {
           				clearInterval(fadeAudio);													// clear interval
						if (Callback != null) {														// Callback present? Call and remove it!
							Callback();
							Callback = null;
						}           				
        			}
        			
   				 }, HTMLfive_Settings.audioFadeTime);
			}
		},
		
		/* .fadeOut - fade out a specific sound over HTMLfive_Settings.audioFadeTime, and play
			AssetName = audio to fade out and stop, e.g. test
			callback  = null (default), otherwise calls function callback
		*/
		fadeOut: function(AssetName, callbackfunction = null) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				var Callback = callbackfunction;
				var fadeAudio = setInterval(function () {
					if (curAudio.volume > 0.1) curAudio.volume -= 0.1;							// check, if volume above 0.1, then reduce
					if (curAudio.volume.toPrecision(1) <= 0.001) {								// toprecision: round to nearest 0.x
						clearInterval(fadeAudio);
						curAudio.volume = 0.0;
						curAudio.pause();
						curAudio.currentTime = 0;
						curAudio.isPlaying = false;
						if (Callback != null) {													// Callback present? Call and remove it!
							Callback();
							Callback = null;
						}
					}
				}, HTMLfive_Settings.audioFadeTime);
			}
		},
		
		/* .addCallback(AssetName, callbackfunction) - add a callback for when a sound has finished playing
			callbackfunction = function() {}
			autoremove 		 = false (default), true = remove the callback automatically
		*/
		addCallback: function(AssetName, callbackfunction, autoremove = false) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				curAudio.Callback = callbackfunction;
				curAudio.addEventListener('ended',()=>{
					if (curAudio.Callback) {													// only call, if a listener is present
						curAudio.Callback();
						if (autoremove) {
							curAudio.removeEventListener('ended', curAudio.Callback);			// remove Listener
							curAudio.Callback = null;
						}
					}
				},{once:true});	// add Listener
			}			
		},
		
		/* .removeCallback(AssetName) - removes all callbacks for when a sound has finished playing
		*/
		removeCallback: function(AssetName) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				if (!curAudio.Callback) { return; }												// no listener? go away
				curAudio.removeEventListener('ended', curAudio.Callback);						// remove Listener
				curAudio.Callback = null;
			}			
		},

		/* .isPlaying(AssetName) - is AssetName playing? 
		*/
		isPlaying: function(AssetName) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				return curAudio.isPlaying;
			}
		},
		
		/* .isPause(AssetName) - is AssetName paused? 
		*/
		isPaused: function(AssetName) {
			var curAudio = this.Cache[AssetName];
			if (curAudio) {
				return curAudio.isPaused;
			}
		},
		
		/* .mute(MusicType, Bool) - mute or unmute (false)
		*/
		mute: function(SoundType, shouldmute) {
			this.MuteTypes[SoundType] = !shouldmute;			// müsste auf 0 setzen!
		}
		
	};
	
	/* Init */
	HTMLfive.Audio.init();
	
