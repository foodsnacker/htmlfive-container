# htmlfive.io 0.0.1

A set of libraries for interactive apps and websites in modern browsers, strictly using HTML5, CSS, JavaScript.

Dual licensed:
- GPL 3.0 for academic and private projects
- licence to be decided for commercial projects

"Electronic Cash" by Joe. G. Burbach with kind permission by the author. (c,p) 2021 by Joe G. Burbach ([https://soundcloud.com/joe-g-burbach](https://soundcloud.com/joe-g-burbach/electronic-cash))

Try some of the functions by yourself. Download the package and run test.html

Current parts and functions:

audio.js 0.0.3
- adds an AudioPlayer-object with autodetection if .OGG or .MP3 can be played, depending on the browser. Prefers OGG, if supported.
- add sound to cache, or remove it from the cache
- Play, Pause, Resume, Stop sound including optional fade-in and fade-out one second before the end
- One-Shot play (removes the file after having finished playing)
- Loop sound, Fade-In, Fade-Out, isPlaying, isPause, isLoaded
- optional Callback for when sounds have finished playing
- defines SFX, Music, Ambient, Speech, UI-Effects (put your .pm3 and .ogg inside the appropriate folder inside audio)
- define standard-volume for different types of audio (set via mandatory settings.js)
- get and set Looped, Fade-In, Fade-Out
- get current position and duration of audio in seconds

html.js 0.0.1
- adds an HTML-element (text) to the DOM
- adds it to the cache, or remove it
- make the text a button

anim.js 0.0.1
- adds a CSS-animation to an element
currently in the works

message.js 0.0.1
- shows a requester with frame-png and OK & Cancle-Buttons
currently in the works