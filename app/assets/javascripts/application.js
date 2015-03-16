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
	var _activePanels = {};

	// 
	// add event listener 
	// 
	ele.addEventListener('click', function(e) {

		if (e.target.hasAttribute('data-action')) {
			switch(e.target.getAttribute('data-action')) {
				case 'headphone':
					headphoneHandler(e);
					break;
				case 'left':
					ctrlHandler(e, 'left');
					break;
				case 'right':
					ctrlHandler(e, 'right');
					break;
				default:
					e.stopPropagation();
			}
		}
	});


	function ctrlHandler(e, action) {
		var eventDetail 	= e.target.parentNode.parentNode,
			ap 				= _artistBuffer[e.target.getAttribute('data-artist')],
			left 			= eventDetail.childNodes[0],
			player			= eventDetail.childNodes[1],
			right			= eventDetail.childNodes[2],
			chevronLeft 	= left.childNodes[0],
			chevronRight 	= right.childNodes[0];

		

		// 
		// laod the previous song in the queue
		// 
		if (action == 'left' && chevronLeft.getAttribute('disabled') != 'true') {

			chevronRight.setAttribute('data-track-id', ap.tracks[ap.currentTrack].uri);
			chevronRight.setAttribute('disabled', 'false');

			ap.updateCurrentTrack(ap.currentTrack - 1);

			if (ap.currentTrack == 0) {
				chevronLeft.setAttribute('disabled', 'true');
			} else {
				chevronRight.setAttribute('data-track-id', ap.tracks[ap.currentTrack - 1].uri)
			}
			var trackURL = e.target.getAttribute('data-track-id');

			player.innerHTML = '';
			loadTrack(trackURL, player);
			
		}
		// 
		// load next song in the queue
		// 
		else if (action == 'right' && chevronRight.getAttribute('disabled') != 'true') {

			chevronLeft.setAttribute('data-track-id', ap.tracks[ap.currentTrack].uri);
			chevronLeft.setAttribute('disabled', 'false');

			ap.updateCurrentTrack(ap.currentTrack + 1);

			if (ap.currentTrack == ap.tracks.length - 1) {
				chevronRight.setAttribute('disabled', 'true');
			} else {
				chevronRight.setAttribute('data-track-id', ap.tracks[ap.currentTrack + 1].uri)
			}
			var trackURL = e.target.getAttribute('data-track-id');
			player.innerHTML = '';
			loadTrack(trackURL, player);
		}
	}

	function headphoneHandler(e) {
		// 
		// hide the event detail panel
		// 
		if (e.target.parentNode.className.match(/active/)) {
			toggleState(e.target, 'unset')
		}
		// 
		// only take action when headphone is clicked
		// 
		else if (!e.target.parentNode.className.match(/active/)) {
			// 
			// all child nodes of the current row
			// 
			var childNodesOfRow = e.target.parentNode.parentNode.childNodes;
			// 
			// if the last node has class name 'event-detail', this means it has been previously processed
			// in this case, we simply toggle the active state
			// 
			var eventDetailNodes = H.find.call(e.target.parentNode.parentNode, 'event-detail');
			
			if (eventDetailNodes.length > 0) {
				toggleState(e.target, 'set')	
			} else {
				var artistString = e.target.getAttribute('data-artist');
				var artistList = new Array();
				// 
				// !!! This can be improved !!!
				// 
				// process the artist string and hopefully get a list of artist names
				// but the string token can be quite random ... 
				// 
				if (artistString.match(/with/)) {
					artistList = artistString.split(/\s+with\s+/);
				} else {
					artistList = artistString.split(/\s?[\+|\||\/]\s?/g);
				}

				for(var i=0; i<artistList.length; i++) {
					var artist_name = artistList[i];
					// 
					// drawAP is the passed along as the callback function
					// it will be called once the information lookup is finished
					// 
					get_user(artist_name, e.target.parentNode, drawAP);
				}
				e.target.parentNode.className += ' active';
			}
		} 
	}
	

	function toggleState(target, state) {
		var firstNode = target.parentNode.parentNode.childNodes[1];
		var allEventDetailNodes = H.find.call(target.parentNode.parentNode, 'event-detail');

		if (state == 'unset') {
			firstNode.className = firstNode.className.replace(/ active/, '');
			allEventDetailNodes.forEach(function(node) {
				node.className = node.className.replace(/ active/, '');
			})
		} else if (state == 'set') {
			firstNode.className += ' active';
			allEventDetailNodes.forEach(function(node) {
				node.className += ' active';
			})
		}
		
	}

	function get_user(artist_name, target, callback) {
		// 
		// if the artist has been processed before, load the result from buffer
		// 
		if (_artistBuffer.hasOwnProperty(artist_name)) {
			callback(target, _artistBuffer[artist_name]);
		} else {
			// 
			// create artist panel
			// 
			var ap = new ArtistPanel(artist_name);
			var artist_username = artist_name.replace(/\s/g, '').toLowerCase();

			var url = "http://api.soundcloud.com/users/" + artist_username + ".json?client_id=" + clientID;
			// 
			// look up artist info in soundcloud
			// 
			H.ajax(url, function(err, response) {
				if (err) {
					callback('Unable to identify artist: ' + ap.artist, target, ap);
				} else {
					// 
					// once artist has been found, update the ap obj and store it in the buffer
					// 
					ap.updateUserInfo(response);
					_artistBuffer[artist_name] = ap;
					// 
					// next, look up the tracks of the artist
					// 
					findTracks(target, ap, callback);
				}
			});
		}
	}

	function findTracks(target, ap, callback) {
		var url = "http://api.soundcloud.com/users/" + ap.artistID + "/tracks.json?client_id=" + clientID;
		H.ajax(url, function(err, response) {
			if (err) {
				// 
			} else {
				ap.updateTrackInfo(response);
				// 
				// done looking up, move on to display the result
				// 
				callback(null, target, ap);
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
			console.log(target.parentNode.childNodes)
			target.parentNode.removeChild(wrapper);
		}, 3000);
	}

	function loadTrack(trackURL, target) {
		var options = {
			auto_play: false,
			show_comments: false,
			buying: false,
			liking: false,
			download: false,
			sharing: false,
			show_user: false,
			show_playcount: false,
			show_artwork: false
		}
		SC.oEmbed(trackURL, options, function(oEmbed) {
			var div = document.createElement('div');
			div.innerHTML = oEmbed.html;
			var iframe = div.childNodes[0];
			iframe.setAttribute('height', '100px');
			target.appendChild(iframe);
		});
	}

	function drawAP(err, target, ap) {

		var makeCtrlButton = function(action) {
			var div = document.createElement('div');
			div.className = 'one column ctrl ' + action;
			
			var chevron = document.createElement('i');
			chevron.className = 'mdi mdi-chevron-' + action;
			chevron.setAttribute('data-action', action);
			chevron.setAttribute('data-artist', ap.artist);

			if (action == 'left' && ap.currentTrack > 0) {
				chevron.setAttribute('disabled', 'false')
				chevron.setAttribute('data-track-id', ap.tracks[ap.currentTrack - 1].uri);
			} else if (action == 'right' && (ap.currentTrack < ap.tracks.length - 1)) {
				console.log('okok')
				chevron.setAttribute('disabled', 'false');
				chevron.setAttribute('data-track-id', ap.tracks[ap.currentTrack + 1].uri);
			} else {
				chevron.setAttribute('disabled', 'true')
			}

			div.appendChild(chevron);

			return div;
		}
		// 
		// 
		// 
		if (err) {

		}
		else if (ap.tracks.length == 0) {
			displayWarning("No track found for " + ap.artist, target);
		} else {
			var d = document.createDocumentFragment();
			var wrapper = document.createElement('div');
			wrapper.className = 'event-detail twelve columns active'
			// 
			// previous track
			// 
			var div1 = makeCtrlButton('left');
			// 
			// play list
			// 
			var div2 = document.createElement('div');
			div2.className = 'ten columns player'
			
			loadTrack(ap.tracks[0].uri, div2);
			// 
			// next track 
			// 
			var div3 = makeCtrlButton('right');

			wrapper.appendChild(div1);
			wrapper.appendChild(div2);
			wrapper.appendChild(div3);

			d.appendChild(wrapper);
			target.parentNode.appendChild(d);
		}

		
	}
	
})();

