var SCService = (function() {

	var path = window.location.protocol + "//api.soundcloud.com/users/";
	var my = {};

	my.init = function(param) {
		if (param) clientID = param;
	}

	my.load = function(req, errCallback, callback) {

		H.ajax(path + req + '?client_id='+clientID, function(err, response) {
			if (err) {
				errCallback(response);
			} else {
				callback(response);
			}
		});
	}

	return my;

})();