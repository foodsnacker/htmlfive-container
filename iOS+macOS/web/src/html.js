	/* html.js 0.0.2
		(c), (p) 2020-2022 Jörg Burbach, Ducks on the Water
		Engine for htmlfive.net with caching for strict HTML5-support. Works in all modern browsers.
		
		Dual-Licence: private or academic (GPL), commercial (proprietary, tbd)
	*/
		
	/* todo: documentation */
			
	var HTML_CSS = `
	/* Elements */
	.html { position: absolute }
	
	/* Buttons */
		.button {}
		.button:hover { cursor: pointer }
	`;
		
	HTMLfive.HTML = {
		Cache: [],
		Target: null,
		addcss: function(styling) { document.querySelector('head').innerHTML+="<style id='htmlcss'>"+ styling +"</style>"; },
		init: function() {	// first call!
			Target = document.getElementById(HTMLfive_Settings.targetdiv);
			this.addcss(HTML_CSS);
		},
		
		// !! opacity!
		add: function(AssetName,AssetHTML,options={'fadein':false,'fadeout':false,'shownow':false}) {	// add an element to the DOM
			if (!this.Cache[AssetName]) {
				this.Cache[AssetName] = document.createElement('div');				// create Element
				var myHTML = this.Cache[AssetName];
				myHTML.setAttribute("id",AssetName);								// set ID
				myHTML.classList.add("html"); // + options.base);							// image type (base, stack, etc)
				myHTML.classList.add(options.layer);										// layer (middle, front)
				myHTML.innerHTML = AssetHTML;												// set HTML !! mehr Möglichkeiten?
				
				myHTML.style.top = options.top;										// position the HTML
				myHTML.style.left = options.left;
				myHTML.style.right = options.right;
				myHTML.style.bottom = options.bottom;
				myHTML.style.width = options.width;
				myHTML.style.height = options.height;
				
				myHTML.style.color = HTMLfive_Settings.textColor;							// use Standard Color 
				if (options.color != null) myHTML.style.color = options.color;				// if set, use Options-Color
				
				myHTML.style.backgroundColor = HTMLfive_Settings.backcolor;								// use Standard Background color
				if (options.backcolor != null) myHTML.style.backgroundColor = options.backcolor;		// if set, use Options-Background color
				
				myHTML.delay = options.delay;												// set delay for continue
				if (myHTML.delay == -1) myHTML.delay = HTMLfive_Settings.imageFadeTime;		// if not set, use Standard Delay
				myHTML.fadein = options.fadein;												// fade in?
				myHTML.fadeout = options.fadeout;											// fade out when removing?
				
				if (options.shownow == true) { this.play(AssetName);}						// display directly?
				
				if (options.callback != null) {												// add Callback
					myHTML.onclick = options.callback;
					myHTML.classList.add("button");
				}
			}
		},
		show: function(AssetName) {
			var curHTML = this.Cache[AssetName];										// even if its the DIV, it has all the information
			if (curHTML) {
				Target.appendChild(curHTML);
				if (curHTML.fadein == true) {												// fade in, if wanted 
					curHTML.classList.add("fadein");
					curHTML.addEventListener('animationend',()=>{								
						curHTML.classList.remove("fadein");
					},{once:true});
				} else {
					curHTML.style.opacity = 1.0;
				}
			}
		},
		remove: function(AssetName,removeFromCache=false) {					 // !! vorher ausblenden
			var curHTML = document.getElementById("html_" + AssetName);						// remove from DIV
			if (curHTML) {
				if (curHTML.fadeout == true) {														// fade in, if wanted 
					curHTML.addEventListener('animationend',()=>{								
						curHTML.classList.remove("fadein");
						this.Cache[AssetName] = null;											// remove from Cache
						curHTML.remove();
					},{once:true});
					curHTML.classList.add("fadeout");
				} else {
					this.Cache[AssetName] = null;											// remove from Cache
					curHTML.remove();
				}
			}
		},
		edit: function(AssetName,AssetHTML,options={}) {
			var curHTML = this.Cache[AssetName];										// even if its the DIV, it has all the information
			if (curHTML) {
				if(AssetHTML != null) curHTML.innerHTML = AssetHTML;
				if(options.top != null) curHTML.style.top = options.top;				// position the HTML
				if(options.left != null) curHTML.style.left = options.left;
				if(options.right != null) curHTML.style.right = options.right;
				if(options.bottom != null) curHTML.style.bottom = options.bottom;
				if(options.width != null) curHTML.style.width = options.width;
				if(options.height != null) curHTML.style.height = options.height;
			}
		},
		makeButton: function(AssetName,callbackfunction = null) {
			var curHTML = this.Cache[AssetName];										// even if its the DIV, it has all the information
			if (curHTML) {
				var Callback = callbackfunction;											// add Callback
				curHTML.onclick = Callback;
				curHTML.classList.add("button");
			}		
		},
		removeButton: function (AssetName) {
			var curHTML = this.Cache[AssetName];										// remove Callback
			if (curHTML) {
				curHTML.onclick = null;
				curHTML.classList.remove("button");
			}		
		}
	}
	
	/* Init */
	HTMLfive.HTML.init();
