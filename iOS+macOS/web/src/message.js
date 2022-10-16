	/* message.js 0.0.1
		(c), (p) 2020-2022 Jörg Burbach, Ducks on the Water
		Engine for htmlfive.net with caching for strict HTML5-support. Works in all modern browsers.
		
		Dual-Licence: private or academic (GPL), commercial (proprietary, tbd)
		
		todo:
		 - Background-Color or Image of requester
		 - size and position
		 - more
	*/

					
	var Message_CSS = `
	/* Message */
	.ui_information { z-index: 200; }
	.ui_backdrop { z-index: 199; position:absolute; top:0; left: 0; right:0; bottom:0; background-color: rgba(32,32,32,0.8); }
	.messageframe { border-image-source: url(''); border-image-slice: 5; border-image-repeat: stretch; border-image-width: 10px; }
	.messagediv { position:absolute; top: calc(50% - 100px); left: calc(50% - 200px); background-color: black; width: 400px; height: 200px; padding:20px; }
	.ui_ok_button { position: absolute; top: calc(50% + 70px); left: calc(50% - 110px); width: 100px; height: 1.4em; background-color: #111; text-align: center; font-size: 1.1em; line-height: 1.4em; }
	.ui_cancel_button { position: absolute; top: calc(50% + 70px); left: calc(50% + 10px); width: 100px; height: 1.4em; background-color: #111; text-align: center; font-size: 1.1em; line-height: 1.4em; }
	`;
		
	HTMLfive.Message = {
		Target: null,
		addcss: function(styling) { document.querySelector('head').innerHTML+="<style id='messagecss'>"+ styling +"</style>"; },
		init: function() { Target = document.getElementById(HTMLfive_Settings.targetdiv); this.addcss(Message_CSS); },
		show: function(AssetName,options) {												// add an element to the DOM
			if (!document.getElementById("message_" + AssetName)) {
				var backdrop = document.createElement('div');							// create backdrop-element
				backdrop.setAttribute("id","message_backdrop_" + AssetName);			// set ID
				backdrop.classList.add("ui_backdrop");									// dim background !! fade!
				backdrop.fadein = options.fadein?false:true;									// fade in?
				backdrop.fadeout = options.fadeout?false:true;									// fade out when removing?

				var myMessage = document.createElement('div');							// create Element
				myMessage.setAttribute("id","message_" + AssetName);					// set ID
				myMessage.classList.add("messagediv"); // + options.base);				// image type (base, stack, etc)
				myMessage.classList.add("ui_information");								// layer (ui_information - frontmost)
				myMessage.classList.add("messageframe");								// frame from image
				myMessage.innerHTML = "<h2>" + options.title + "</h2><p>" + options.text + "</p>";	// set HTML
				myMessage.innerHTML += "<span class='ui_ok_button' onclick=" + options.ok + "();>OK</span>";
				myMessage.innerHTML += "<span class='ui_cancel_button' onclick=" + options.ok + "();>Cancel</span>";

				myMessage.style.borderImageSource = options.framepng?"url('image/ui/"+options.framepng+"')":"url('image/ui/requesterwindow.png')";
				
/*				myMessage.style.top = options.top + "px";										// position the HTML
				myMessage.style.left = options.left + "px";
				myMessage.style.right = options.right + "px";
				myMessage.style.bottom = options.bottom + "px";
				myMessage.style.width = options.width + "px";
				myMessage.style.height = options.height + "px";*/
				
				myMessage.style.color = HTMLfive_Settings.textColor;							// use Standard Color 
				if (options.color != null) myMessage.style.color = options.color;				// if set, use Options-Color
				
				myMessage.style.backgroundColor = HTMLfive_Settings.backcolor;							// use Standard Background color
				if (options.backcolor != null) myMessage.style.backgroundColor = options.backcolor;		// if set, use Options-Background color
				
				myMessage.delay = options.delay;												// set delay for continue
				if (myMessage.delay == -1) myMessage.delay = HTMLfive_Settings.imageFadeTime;	// if not set, use Standard Delay
				myMessage.fadein = options.fadein?false:true;									// fade in?
				myMessage.fadeout = options.fadeout?false:true;									// fade out when removing?

				Target.appendChild(backdrop);
				backdrop.appendChild(myMessage);
				
				// Show it!
				if (myMessage.fadein == true) {												// fade in, if wanted 
					myMessage.classList.add("fadein");
					backdrop.classList.add("fadein");
					myMessage.addEventListener('animationend',()=>{								
						myMessage.classList.remove("fadein");
						backdrop.classList.remove("fadein");
					},{once:true});
				} else {
					backdrop.style.opacity = 1.0;
					myMessage.style.opacity = 1.0;
				}
			}
		},
		hide: function(AssetName) {					 // !! vorher ausblenden
			var curMessage = document.getElementById("message_" + AssetName);						// remove from DIV
			var backdrop = document.getElementById("message_backdrop_" + AssetName);
			if (curMessage) {
				if (curMessage.fadeout == true) {													// fade out, if wanted 
					curMessage.addEventListener('animationend',()=>{								
						curMessage.classList.remove("fadein");										// remove
						curMessage.remove();
						backdrop.classList.remove("fadein");										// remove
						backdrop.remove();
					},{once:true});
					curMessage.classList.add("fadeout");
					backdrop.classList.add("fadeout");
				} else {
					curMessage.remove();
					backdrop.remove();
				}
			}
		},
	}
	
	/* Init */
	HTMLfive.Message.init();
	