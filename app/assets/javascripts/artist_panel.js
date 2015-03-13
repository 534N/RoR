var ArtistPanel =  function(name) {
	this.artist = (typeof(name) == 'undefined') ? null : name;
	this.artistID = null;
	this.avatar = null;
	this.tracks = [];
}

ArtistPanel.prototype.setName = function(name) {
	this.artist = name;
};

ArtistPanel.prototype.updateUserInfo = function(userObj) {
	this.artistID = userObj.id;
	this.avatar = userObj.avatar_url;
};

ArtistPanel.prototype.updateTrackInfo = function(tracks) {
	this.tracks = tracks;
}


