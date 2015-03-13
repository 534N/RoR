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
	var clientID = '998651536d9a2dcea17749d75862ef39';

	SC.initialize({
	 	client_id: 	clientID
	});

	var ele = document.getElementById('music-app');
	var _artistBuffer = {};

	ele.addEventListener('click', function(e) {
		if (e.target.className.match(/artist/)) {
			var artistString = e.target.innerHTML.trim();
			var artistList = new Array();

			if (artistString.match(/with/)) {
				artistList = artistString.split(/\s+with\s+/);
			} else {
				artistList = artistString.split(/\s?[\+|\||\/]\s?/g);
			}

			for(var i=0; i<artistList.length; i++) {
				var artist_name = artistList[i];
				get_user(artist_name, e.target, displayAP);
			}
		}
	});

	function get_user(artist_name, target, callback) {

		if (_artistBuffer.hasOwnProperty(artist_name)) {
			console.log('>>>>>>>>>>>>>>', _artistBuffer[artist_name])

		} else {
			var ap = new ArtistPanel(artist_name);
			var artist_username = artist_name.replace(/\s/g, '').toLowerCase();

			var url = "http://api.soundcloud.com/users/" + artist_username + ".json?client_id=" + clientID;
			ajax(url, function(err, response) {
				if (err) {
					displayWarning('Unable to identify artist: ' + ap.artist, target);
				} else {
					ap.updateUserInfo(response);
					_artistBuffer[artist_name] = ap;
					findTracks(target, ap, callback);
				}
			});
		}
	}

	function findTracks(target, ap, callback) {
		var url = "http://api.soundcloud.com/users/" + ap.artistID + "/tracks.json?client_id=" + clientID;
		ajax(url, function(err, response) {
			if (err) {
				// 
			} else {
				ap.updateTrackInfo(response);
			}
		});
	}


	function displayWarning(msg, target) {
		var wrapper = document.createElement('div');
		wrapper.className = 'warning twelve columns'

		var text = document.createTextNode(msg);
		wrapper.appendChild(text);

		target.parentNode.appendChild(wrapper);

		setTimeout(function() {
			target.parentNode.removeChild(wrapper);
		}, 3000);
	}

	function displayAP(target, ap) {
		// 
	}

	function ajax(url, callback) {
		var r = new XMLHttpRequest();
		r.open("GET", url, true);
		

		r.onreadystatechange = function () {
			if (r.readyState == 4) {
				if (r.status == 200 ) {
					callback(null, JSON.parse(r.responseText));
				} else {
					callback(r.status, null);
				}
			} else {
				return;
			}
		};

		r.send();
	}


	
})();

