function show (name) {
	// Need to add new sections to this array for "show" to work
	var arr = ["home","musicians","events","contact","link","media"];
	for (i=0;i<arr.length;i++){
		var div = document.getElementById(arr[i]);
			if (arr[i] == name) {
				div.style.display = "block";
				continue;
			}
			else {
				div.style.display = "none";
			}
	}
}
function load(n) {
if (isNaN(n)) {return false;}
var vPlaylist = [
				 '<iframe src="//player.vimeo.com/video/78447503" width="500" height="283" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>', // Westfalia
				 '<iframe src="//player.vimeo.com/video/78447504" width="500" height="283" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' // Mazurka
				];

document.getElementById('embedding').innerHTML = vPlaylist[n];
}