	/* settings.js 0.0.1
		(c), (p) 2020-2022 Jörg Burbach, Ducks on the Water 
		Settings-file for htmlfive.net
		
		Dual-Licence: private or academic (GPL), commercial (proprietary, to be decided)
	*/
	
var HTMLfive_Settings = {
	"targetdiv":"game",								// the Div, where the game lives
	"canvasColor":"black",							// Background-Color of Canvas
	
	/* Audio */
	"audioFadeTime": 200,							// Fading time of audio in ms
	"audioVolume": [ 1.0,							// default-volume SFX
					 1.0,							// music
					 1.0,							// ambient
					 1.0,							// speech
					 1.0 ],							// ui
	"audioFolder": ["audio/sfx/",					// set several folders for Audio
					"audio/music/",	
					"audio/ambient/",
					"audio/speech/",
					"audio/ui/"],
	
	/* Images */
	"imageFolder":"image/",							// load images from where
	"imageFadeTime": 500,
	
	/* HTML5-Text */
	"textColor":"white",
	"backColor":"transparent",
	
	/* Videos */	
	"videoFolder":"video/",							// load videos from wjhere
};

	HTMLfive.Settings = {
		init: function() {	// first call!
			document.querySelector("html").style.backgroundColor = HTMLfive_Settings["canvasColor"];
		}
	}
	
	/* Init */
	HTMLfive.Settings.init();
