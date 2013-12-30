function Track (t, d, s) {
	this.t = t; // Title
	this.d = d; // Description
	this.s = s; // Source
}

var Playlist = [
				new Track (	"Mazurkas", // Title
							"Sonny's, Tommy's, Bridget's", // Description
							"https://dl.dropboxusercontent.com/u/22199640/1.mp3"), // Source
							
				new Track ("Polkas","Dennis Murphy, Jenny Lynn. We call this the " + 
							"heart attack Polka 'cuz we go faster and faster 'till " +
							"people drop out from exhaustion!",
							"https://dl.dropboxusercontent.com/u/22199640/DennisMurphyPolka.mp3")
			   ];

			   
			   