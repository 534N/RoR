var H = (function() {
	
	var my = {};

	my.ajax = function(url, callback) {
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

	my.find = function(filter) {
		console.log(this)
		var childNodes = this.childNodes;
		var patt = new RegExp(filter);

		var result = [];
		for(var i=0; i < childNodes.length; i++) {
			if (childNodes[i].hasOwnProperty('className')) {
				if (patt.test(childNodes[i].className))
					result.push(childNodes[i]);
			}
		}

		return result;
	}

	return my;

})();