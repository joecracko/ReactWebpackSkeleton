var ProjectName = window.ProjectName = window.ProjectName || {};

ProjectName.LoginModule = function(){
	var currentlyLoggedInUser = null;

	var SubmitLogin = function(ReactInstance, Login, callback){
		var xhr = new XMLHttpRequest();
	    ReactInstance.serverRequest = xhr;

	    xhr.onreadystatechange = function () {
	      var DONE = 4; // readyState 4 means the request is done.
	      var OK = 200; // status 200 is a successful return.
	      if (xhr.readyState === DONE) {
	        if (xhr.status === OK) {
	          var response = JSON.parse(xhr.responseText);
	          callback(response);
	        } else {
	          console.log('Error: ' + xhr.status); // An error occurred during the request.
	        }
	      }
	    }

	    xhr.open('POST', '/api/login');
	    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
	    xhr.send(JSON.stringify(Login));
	};

	var GetLoginStatus = function(ReactInstance, callback){
		var xhr = new XMLHttpRequest();
		ReactInstance.serverRequest = xhr;

		xhr.onreadystatechange = function() {
			var DONE = 4; // readyState 4 means the request is done.
			var OK = 200; // status 200 is a successful return.
			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {
					var response = JSON.parse(xhr.responseText);
					callback(response);
				} else {
					console.log('Error: ' + xhr.status); // An error occurred during the request.
				}
			}
		}

		xhr.open('GET', '/api/getLoginStatus');
	    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
	    xhr.send(null);
	}

	var Logout = function(callback){
		var xhr = new XMLHttpRequest();
		//ReactInstance.serverRequest = xhr;

		xhr.onreadystatechange = function() {
			var DONE = 4; // readyState 4 means the request is done.
			var OK = 200; // status 200 is a successful return.
			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {
					var response = JSON.parse(xhr.responseText);
					callback(response);
				} else {
					console.log('Error: ' + xhr.status); // An error occurred during the request.
				}
			}
		}

		xhr.open('GET', '/api/logout');
	    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
	    xhr.send(null);
	}

	return {
		SubmitLogin : SubmitLogin,
		GetLoginStatus: GetLoginStatus,
		Logout: Logout
	};
}();