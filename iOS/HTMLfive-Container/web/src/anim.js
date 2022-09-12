	/* anim.js 0.0.1
		(c), (p) 2020-2022 Jörg Burbach, Ducks on the Water 
		Animation-Engine using CSS with caching for strict HTML5-support. Works in all modern browsers.

		Dual-Licence: private or academic (GPL), commercial (proprietary, tbd)
		
		to-do
			- almost everything
			- Error-Checks
			- playlist (Jukebox or list of samples)
			- Collision-Callback
	*/
		//		animation-timing-function: step-start|step-end|steps(int,start|end)|cubic-bezier(n,n,n,n)

	var Anim_CSS = `
	/* Animations */
	@keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
	@keyframes fadeout { from { opacity: 1; } to { opacity: 0; } }
	@keyframes shrinkout { from { opacity: 1; max-height: 100%; } to { opacity: 0; max-height: 0; } }
	@keyframes fadebackout { from { background-color: #f39f18; border: 2px solid #f6b957; } to { background-color: transparent; border: 2px solid transparent; } }

	.fadein { animation: fadein 1.25s forwards; }
	.fadeinslow { animation: fadein 0.75s forwards; }
	.fadeout { animation: fadeout 0.25s forwards; }
	.fadeoutslow { animation: fadeout 0.75s forwards; }
	.shrinkout { animation: shrinkout 0.75s forwards; }
	.fadebackout { animation: fadebackout 0.25s forwards; }
	`;
	
	HTMLfive.Anim = {
		TypeConts: [ "linear","ease","ease-in","ease-out","ease-in-out" ],
		Types: { linear:0, ease:1, easein:2, easeout:3, easeinout:4 },
		Target: null,
		addcss: function(styling) { document.querySelector('head').innerHTML+="<style id='animcss'>"+ styling +"</style>"; },
		init: function() {	// first call!
			Target = document.getElementById(HTMLfive_Settings.targetdiv);
			this.addcss(Anim_CSS);
		},
		play: function(animName) {
			var curAnim = document.getElementById("anim_" + animName);
			if (curAnim) { curAnim.classList.add("class_anim_"+animName); }										// run prepared animation class
		},
		
		pause: function(animName) {
			var curAnim = document.getElementById("anim_" + animName);
			if (curAnim) { curAnim.classList.remove("anim_"+animName); }										// remove prepared animation class
		},
		
		hide: function(animName) {
			var curAnim = document.getElementById("wrap_anim_" + animName);										// hide the Animation
			if (curAnim) { curAnim.style.visibility = "hidden"; }
		},
		
		show: function(animName) {
			var curAnim = document.getElementById("wrap_anim_" + animName);										// Show the Animation
			if (curAnim) { curAnim.style.visibility = "visible"; }
		},
		
		setLayer: function(animName,layer) {
			var curAnim = document.getElementById("wrap_anim_" + animName);										// set Layer of Animation
			if (curAnim) { curAnim.style.zIndex = layer; }
		},
		
		isColliding: function(animName,otherDivName) {
			var curAnim = document.getElementById("wrap_anim_" + animName);
			var otherAnim = document.getElementById("wrap_anim_" + otherDivName);
			if (curAnim) {
				d1 = curAnim.getBoundingClientRect();															// get bounding boxes
				d2 = otherAnim.getBoundingClientRect();
				var d1_top = d1.x + d1.height;																	// get positions
				var d1_left = d1.y + d1.width;
				var d2_top = d2.x + d2.height;
				var d2_left = d2.y + d2.height;

				var not_colliding = ( d1_top < d2.x || d1.x > d2_top || d1_left < d2.y || d1.y > d2_left );		// compare
				return ! not_colliding;				
			}		
		},
		
		
		/* Optionen:
		- Startdelay
		- mehrere nacheinander
		- Richtung
		- Easing
		- Callback		
		*/
		
		animationended: function(curObject) {														// helper-function for ENDING
			curObject.addEventListener('animationend',()=>{
				curObject.style.top = curObject.tox + "px";											// pinpoint the current position
				curObject.style.left = curObject.toy + "px";
				curObject.classList.remove(curObject.animname);
				document.getElementById(curObject.animname).remove();								// remove the animation from HEAD
			},{once:true});
		},
		
		animmove: function(curObject) {																// helper-function for MOVING
			var curAnim = "@keyframes " + curObject.animname + " { to { top:" + curObject.tox + "px; left:" + curObject.toy + "px; } }";
				curAnim += "." + curObject.animname + " { animation: " + curObject.animname + " " + curObject.duration + "s " + curObject.direction +"; }";
			document.querySelector('head').innerHTML+="<style id='" + curObject.animname +"'>"+ curAnim +"</style>";
			curObject.classList.add(curObject.animname);
		},
		
		animoptions: function(curObject,options) {
			curObject.duration = options.duration;
		},
		
		moveTo: function(AssetName,options) {
			var curObject = document.getElementById(AssetName);											// get the DIV
			if (curObject) {																			// create the animation and add it to HEAD
				curObject.animname = AssetName + "_moveto";												// save information in the object
				curObject.tox = options.tox;
				curObject.toy = options.toy;
				this.animoptions(curObject,options);
				if (options.direction) { curObject.direction = options.direction; } else { curObject.direction = "forwards"; }
				this.animmove(curObject);
				this.animationended(curObject);															// add Ended-Event
			}
		},
		
		moveBy: function(AssetName,options) {
			var curObject = document.getElementById(AssetName);											// get the DIV
			if (curObject) {
				curObject.animname = AssetName + "_moveby";												// save information in the object
				curObject.tox = curObject.offsetTop + options.tox;
				curObject.toy = curObject.offsetLeft + options.toy;
				this.animoptions(curObject,options);
				if (options.direction) { curObject.direction = options.direction; } else { curObject.direction = "forwards"; }
				this.animmove(curObject);
				this.animationended(curObject);															// add Ended-Event
			}
		}
	};
	
	/* Init */
	HTMLfive.Anim.init();
