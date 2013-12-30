/*
Description and index:

initiatePlayer() -- _1* generates all components of player
					and attaches them to the "playerwrapper" div.
				 -- _2* adds event listener to timeupdate of audio to
					control the movement of seek bar
				 -- _3* adds event listener for seek bar onclick
				 
run(arr)		 -- _4* takes "arr", the playlist array, and creates links
						in the "playlist" div

loadPl(anchor)   -- _5* takes (this) from <a>, loads the player with
						the link's object

trackDisplay(title,description)
				 -- _6* takes "title" and "description", updates
						"trackTitle" div and "trackDescription" div.

toggle() 		 -- _7* flips between Play and Pause picture, 
						and pauses/plays the track.

compatiblePlayer()
				 -- _8* checks to see if audio.play is a valid prop.
						if not, create Embed tag. Else, call initiatePlayer()

stop()			 -- _9*  stop the music, reset seek position and audio.currentTime.						

numberTime(n)	 -- _10* 'n' is duration in seconds -- converts to mm:ss

timeDisplay() 	 -- _11* passes "duration" and "currentTime" to numberTime, 
						 then updates display.
*/

// _1
function initiatePlayer() {

// create link to Playlist and CSS.

var playerCSS = document.createElement('link');
playerCSS.setAttribute('href','audioplayer/player.css');
playerCSS.setAttribute('type','text/css');
playerCSS.setAttribute('rel','stylesheet');

document.body.appendChild(playerCSS);

// set div to attach to:
	var parent = document.getElementById('media');//document.getElementById('playerWrapper');
// set wrapper as player
	var player = document.createElement('div');
	player.setAttribute('id','player');
	
	
// Start building divs	
	var nowPlaying = document.createElement('div');
	nowPlaying.setAttribute('id','nowPlaying');
	var trackTitle = document.createElement('span');
	trackTitle.setAttribute('class','trackTitle');
	trackTitle.innerHTML = '<br>';
	var trackDescription = document.createElement('span');
	trackDescription.setAttribute('class','trackDescription');
	
	// Now Playing block
	nowPlaying.appendChild(trackTitle);
	// line break
	nowPlaying.appendChild(document.createElement('br'));
	nowPlaying.appendChild(trackDescription);
	
	var controlP = document.createElement('div');
	controlP.setAttribute('class','control play');
	controlP.setAttribute('onclick','toggle()');
	var toggle = document.createElement('div');
	toggle.setAttribute('id','toggle');
	toggle.setAttribute('class','arrow');
	var controlS = document.createElement('div');
	controlS.setAttribute('class','control stop');
	controlS.setAttribute('onclick','stop()');
	var stop = document.createElement('div');
	stop.setAttribute('class','square');
	var current = document.createElement('span');
	current.setAttribute('class','currTime');
	current.innerHTML = '--:--';
	
	// Controls block
	controlP.appendChild(toggle);
	controlS.appendChild(stop);
	
	var seekWrapper = document.createElement('div');
	seekWrapper.setAttribute('id','seekWrapper');
	var progress = document.createElement('div');
	progress.setAttribute('class','progressBar');
	var meter = document.createElement('div');
	meter.setAttribute('class','meterValue');
	meter.style.left = '0%';
	var duration = document.createElement('span');
	duration.setAttribute('class','durTime');
	duration.innerHTML = '--:--';
	
	// Progress meter
	progress.appendChild(meter);
	seekWrapper.appendChild(progress);
	
	// audio tags
	var audio = document.createElement('audio');
	audio.setAttribute('id','audio');
	
	// playlist wrapper
	var pl = document.createElement('div');
	pl.setAttribute('id','playlist');
	
	// assemble all
	player.appendChild(audio);
	player.appendChild(nowPlaying);
	player.appendChild(controlP);
	player.appendChild(current);
	player.appendChild(controlS);
	player.appendChild(seekWrapper);
	player.appendChild(duration);
	
	var playerBox = document.createElement('div');
	playerBox.setAttribute('id','playerBox');
	
	playerBox.appendChild(player);
	playerBox.appendChild(pl);
	
	// attach to parent
		//parent.appendChild(playerBox);
	//parent.insertBefore(playerBox,parent.firstChild);
	parent.querySelector('p').appendChild(playerBox);
	//parent.appendChild(player);
	//player.appendChild(pl);
	
	// _2
	// initialize event handlers
	// Event listener for updating meter position
	document.getElementById('audio').addEventListener('timeupdate',function(){
	
	
		var meterValue = document.getElementsByClassName('meterValue')[0];
	// went with 90% instead of 100% to accommodate for width of meterValue,
	// calculated by px width - meterValue width (150) / px width (166).
		var string = (this.currentTime / this.duration * 90.36145)+ '%';
		
		// update time display
		timeDisplay();
		
		// reset player at end of song
		if (this.currentTime < this.duration) {
			meterValue.style.left = string;
		}
		else {
			meterValue.style.left = '0%';
			document.getElementById('toggle').className = 'arrow';
			document.getElementsByClassName('currTime')[0].innerHTML = '00:00';
		}
		
	})

	// _3
	// Event handler for clicking through song position:
	document.getElementsByClassName('progressBar')[0].onclick = setSongPosition;
	
	// this sets the song to clicked position.
	function setSongPosition(e){
	//Gets the offset from the left so it gets the exact location.
		var songSliderWidth = this.offsetWidth;
		// I think this is for cross-browser compatibility...
		var evtobj=window.event? event : e;
		var clickLocation = evtobj.layerX - this.offsetLeft;

	// again, using the meterValue.width - progressBar.width of 90%.
		var percentage = (clickLocation/(songSliderWidth*.9036145));

	//Sets the song location with the percentage.

	// > 0 to prevent negative percentages from restarting audio.
		if (percentage > 0) {
			audio.currentTime = audio.duration * percentage;
		}
	}

} // END OF INITIATEPLAYER()



// _4
// function to build playlist links
//*** run(Playlist); // initiate playlist.
function run (arr) {
	// div to build playlist in
	var pl = document.getElementById('playlist');
    var ul = document.createElement('ul');
    for (var i = 0; i < arr.length; i++ ) {
		// for each object in array, create li
        var li = document.createElement('li');
		// for each key in object, grab props for <a>
        for (var key in arr[i]){
            if (key == 's') {var src = arr[i][key]};
            if (key == 't') {var title = arr[i][key]};
			if (key == 'd') {var des = arr[i][key]};
        }
        li.innerHTML = '<a href="javascript:void(0)" value="' +
						src + 
						'" name="' + 
						des + 
						'" onclick="loadPl(this);">' +
						title +
						'</a>';
        ul.appendChild(li);
    }    
	// after looping through, attach to 'playlist' div
    pl.appendChild(ul);
	// grab first track (first <a>) into player
	loadPl(pl.querySelector('a'));
}

// _5
// function to load track
function loadPl (anchor) {
var audio = document.getElementById('audio');
	// remove the old source if exists
	if (audio.querySelector('source')){
		audio.removeChild(audio.querySelector('source'));
	}
	// add a new Source element
	var s = document.createElement('source');
	// set src = anchor's "value" attribute
	s.setAttribute('src',anchor.getAttribute('value'));
	s.setAttribute('type','audio/mp3');
	audio.appendChild(s);
	// apparently also need to change audio's src attribute
	audio.setAttribute('src',anchor.getAttribute('value'));

	// change the title / description
	trackDisplay(anchor.innerHTML,anchor.getAttribute('name'));
	// update Time Display:
	// Keep checking every 10 ms until audio.duration exists
	// 		or "check" is true (e.g. give up after 500 ms), 
	// 		then run timeDisplay.
	var check = null;
	var display = setInterval(function() {
			if (audio.duration || check == true){
				timeDisplay();
				//setSongPosition();
				clearInterval(display);
			}
		},10);
	// clear the Interval if no track is loading (if error)
	var displayCheck = setTimeout(function() {
			if (!audio.duration) {
				check = true;
			}
		}, 1000);
	
}

/*End Playlist Experiment*/

// _6
// update track title/description
function trackDisplay(title,descrip){
	document.getElementsByClassName('trackTitle')[0].innerHTML = title;
	document.getElementsByClassName('trackDescription')[0].innerHTML = descrip;
}

// _7
// toggle between Play and Pause
function toggle () {
var audio = document.getElementById('audio');
	var b = document.getElementById('toggle');
	
	// if it's arrow, set it to pause and play the song
	if (b.className == 'arrow') {
		b.className = 'pause'; 
		audio.play();
	}
	// otherwise, set to play and pause the track
	else {
		b.className = 'arrow'; 
		audio.pause();
	}
}


// _8
// In progress... 
// This should be the first thing run, and if success,
//  should build css player.
function compatiblePlayer() {
	
	var test = document.createElement('audio');
	var exists = document.getElementById('audio');
	
	var result = (test.play);
	
	//alert(result?"Looks good!":"uh oh... ");
	if (!result) {
			var embed = document.createElement('embed');
			embed.setAttribute("src","1.mp3");
			embed.setAttribute("autostart",false);
			embed.setAttribute("loop",false);
			
			document.body.appendChild(embed);
// 			instead of hiding, should not even build it.
//			document.getElementById('player').style.display = "none";
	}
	else if (!exists){
		initiatePlayer(); // build "player"
		run(Playlist); // load the Playlist
	}
}

// _9
function stop (){
var audio = document.getElementById('audio');
	var meterValue = document.getElementsByClassName('meterValue')[0];
// reset "play" button
	document.getElementById('toggle').className = 'arrow';
// set audio position to 0
if (audio.currentTime) {
	audio.currentTime = 0;

}
// reset the seek bar if !currentTime
else {
	meterValue.style.left = 0; 
}
// and pause the audio.
	audio.pause();
}

// _10
function numberTime(n) {
// transforms seconds into min:sec format
	var min = Math.floor(n / 60) + '';
	var secs = Math.floor(n - min * 60) + '';
	
	min = min.length == 1 ? '0' + min : min;
	secs = secs.length == 1 ? '0' + secs : secs;
	
	// if NaN, display "blank" time:
	return isNaN(n)?'--:--':min + ':' + secs;
}

// _11
// update Time Display
function timeDisplay() {
var audio = document.getElementById('audio');
	var timeDur = document.getElementsByClassName('durTime')[0];
	var timeCur = document.getElementsByClassName('currTime')[0];
	
	timeDur.innerHTML = numberTime(audio.duration);
	timeCur.innerHTML = numberTime(audio.currentTime);

}
