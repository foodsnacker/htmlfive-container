	/* image.js 0.0.1
		(c), (p) 2020-2022 Jörg Burbach, Ducks on the Water
		Engine for htmlfive.net with caching for strict HTML5-support. Works in all modern browsers.
		
		Dual-Licence: private or academic (GPL), commercial (please see: https://htmlfive.net)
	*/
	
	HTMLfive.Image = {
		ImageTypes: { background:0, ui:1 },
		Cache: [],
		Target: null,
		init: function() { this.Target = document.getElementById(HTMLfive_Settings.targetdiv); },		// first call, no action...
		
		/* .add - add an image to the cache
			AssetName  = file to load with suffix, uses HTMLfive_Settings.imageFolder
			ImageTypes = image-type, see HTMLfive_ImageTypes (background, ui)
			options    = array of options, depending on imageType (background = 0, will fit horizontally)
						 top, left, right, bottom, width, height - position is always fixed, you can use:
						 		top, left, width, height         - put an image pixel perfect to a position
						 		top, left, right, bottom		 - scale image with screen zoom
 						 fadein (boolean)		   				 - false (default) = no fade in, uses HTMLfive_Settings.imageFadeTime
						 fadeout (boolean)		   				 - false (default) = no fade out, uses HTMLfive_Settings.imageFadeTime
						 
		*/
		add: function(AssetName,imageType,options) {													// add an image
			if (!this.Cache[AssetName]) {
				var temp = HTMLfive_Settings.imageFolderBase + '/' + HTMLfive_Settings.imageFolder[imageType] + '/' + AssetName;
				var myImage = new Image(temp);
				myImage.src = temp;																		// set URL
				myImage.setAttribute('id','image_' + AssetName);										// set ID
				myImage.classList.add('img_' + HTMLfive_Settings.imageFolder[imageType]);				// image type

				myImage.style.top = options.top;														// position the image
				myImage.style.left = options.left;
				myImage.style.right = options.right;
				myImage.style.bottom = options.bottom;
				myImage.style.width = options.width;													// width and height
				myImage.style.height = 'auto';//options.height;
				myImage.style.maxHeight = '100%';
				
				if (imageType == 0) {
					myImage.style.objectFit = 'cover'; 												// contain, will use full width
					myImage.style.width = '100%';
					myImage.style.height = 'auto';
				}
	
				myImage.fadein = options.fadein;
				/*	myImage.classList.add(options.layer);														// !! layer (middle, front)
				myImage.delay = options.delay;																// set delay for continue
				if (myImage.delay == -1) myImage.delay = HTMLfive_Settings.entryStandardDelay;				// maybe, Standard Delay
			*/
				/*if (options.clicktocontinue) {																		// click to advance
					myImage.setAttribute("onclick", "HTMLfive.Image.displayClick('" + AssetName + "');");
					myImage.classList.add("imageclick");
					myImage.displayClick = true;
				}*/
				/*
				if (options.base == "base") {																		// base-images need a DIV around
					var div = document.createElement("div");														// create a DIV with holds the Image
					div.setAttribute("id","imagediv_" + AssetName);
					div.classList.add("imageinline");
	
	// !! das hier muss noch auf das DIV angewendet werden - oder play muss angepasst werden!
	div.delay = myImage.delay;																		// put info onto DIV as well
					div.appendChild(myImage);																		// add the image
					this.Cache[AssetName] = div;															// copy image with DIV to Cache
				} else {
					myImage.isStacked = true;																		// is Stacked!
					myImage.targetName = options.targetname;														// on which image?
				}*/
				
				this.Cache[AssetName] = myImage;
			}
		},
		
		/* .show - show an added image from the cache
			AssetName  = image to show
			options    = array of options
 						 fadein (boolean) - false (default) = no fade in, uses HTMLfive_Settings.imageFadeTime
		*/
		show: function(AssetName,options='') {
			var curImage = this.Cache[AssetName];
			if (curImage) {
				if ((curImage.fadein == true) || (options.fadein == true)) this.fader(AssetName,'in'); 	// fade in
				HTMLfive.Image.Target.appendChild(curImage);											// add to DOM
			}
		},

		
		/* .remove - removes an displayed image from DOM and the cache
			AssetName = image to show
			options   = array of options
 						 fadeout (boolean) - false (default) = no fade out, uses HTMLfive_Settings.imageFadeTime, removed after use
		*/
		remove: function(AssetName,options='') {																	// removes the image form DOM and Cache
			var curImage = this.Cache[AssetName];
			if (curImage) {
				if ((curImage.fadeout == true) || (options.fadeout == true)) curImage.classList.add("fadeout"); // fade out
				curImage.addEventListener('animationend',()=>{curImage.classList.remove("fadeout");this.Cache[AssetName]=null;curImage.remove();},{once:true});
			}
		},
		
		/* .fader - fades in or out
			AssetName = image to fade
			direction = in: fade in, out: fade out	
		*/
		fader(AssetName,direction) {
			var curImage = this.Cache[AssetName];
			if (curImage) {
				curImage.classList.add("fade" + direction);
				curImage.addEventListener('animationend',()=>{curImage.classList.remove("fade" + direction);},{once:true});
			}
		}
		
	/*	displayClick(AssetName) { // !!
			var curImage = this.Cache[AssetName];
			if (curImage) {			// auf click entfernen
				if (curImage.fadeout == true) {
					curImage.classList.add("shrinkout");
					curImage.addEventListener('animationend',()=>{ShowGoOn(curImage.delay);curImage.remove();},{once:true});
				} else {
					ShowGoOn(curImage.delay);
				}
			}
		}, */
	};
		
	/* Init */
	HTMLfive.Image.init();
	
