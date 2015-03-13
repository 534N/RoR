// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

(function() {
	var ele = document.getElementById('music-app');

	ele.addEventListener('click', function(e) {
		console.log(e.target)
		var artistString = e.target.innerHTML.trim();
		var artistList = new Array();

		artistList = artistString.split(/\s+[\+|with|\||\/]\s+/g);

		for(var i=0; i<artistList.length; i++) {
			var artist_id = artistList[i].replace(/\s/g, '');
			var user_url = ajax(artist_id);

		}
	});

	function ajax(artist_id) {
		var url = "http://api.soundcloud.com/users/" + artist_id.toLowerCase() + ".json?client_id=998651536d9a2dcea17749d75862ef39";

		var r = new XMLHttpRequest();
		r.open("GET", url, true);
		r.onreadystatechange = function () {
			if (r.readyState != 4 || r.status != 200) return;
			console.log("Success: ", JSON.parse(r.responseText));
		};
		r.send();
	}

	
})();

