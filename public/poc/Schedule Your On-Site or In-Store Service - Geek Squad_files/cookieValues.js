(function (context) {

	context.define(
    [
		'/csi-survey/csiassets/scripts/models/cookieHandling.js',
        '/csi-survey/csiassets/scripts/models/globalJSVariables.js'
    ],
    function (cookieHandling, globalVariables) {
    	'use strict';
    	//Constructor
    	var cookieValues = function () {
    		var self = this;
    		self.globalVars = new globalVariables();
    		self.cookies = new cookieHandling();
    		//self.encoding = new base64();
    	};

    	cookieValues.prototype.init = function () {
    		var self = this;
    		var cookieData = self.cookies.getCookieValue('yes_cookie');
    		if (cookieData != null && cookieData.length > 0) {
    			var cookieSplit = cookieData.split(self.globalVars.variables().cookieSeparator);
    			for (var i = 0; i < cookieSplit.length; i++) {
    				var valueName = cookieSplit[i].split(self.globalVars.variables().valueSeparator)[0];
    				var valueResult = cookieSplit[i].split(self.globalVars.variables().valueSeparator)[1];

    				if (typeof (self.values[valueName]) != 'undefined')
    					self.values[valueName].result = valueResult;
    			}
    		}

    		self.gatherValues();
    	};

    	cookieValues.prototype.gatherValues = function () {
    		var self = this;
    		setInterval(function () {
    			self.runValues();
    		}, 1000);
    	};

    	cookieValues.prototype.runValues = function () {
    		var self = this;
    		var needUpdate = false;

    		for (var key in self.values) {
    			if (self.values[key].result.length == 0 || self.values[key].once == false) {
    				self.values[key].once = true;

    				var result = eval(self.values[key].value);
    				if (typeof (result) == 'undefined' || result == null)
    					result = '';

    				var currentResult = self.values[key].result;
    				if (result != currentResult)
    					needUpdate = true;

    				self.values[key].result = result;
    			}
    		}

    		if (needUpdate == true)
    			self.updateValues();
    	};

    	cookieValues.prototype.updateValues = function () {
    		var self = this;
    		var valueString = '';

    		for (var key in self.values) {
    			valueString += key;
    			valueString += self.globalVars.variables().valueSeparator;
    			valueString += self.values[key].result;
    			valueString += self.globalVars.variables().cookieSeparator;
    		}

    		valueString = valueString.replace(/#\$#$/, ''); //tailend self.globalVars.variables().cookieSeparator replace

    		self.cookies.setYesCookie(valueString);
    	};

    	cookieValues.prototype.values = {};
    	cookieValues.prototype.values['Flash'] = { once: true, result: '', value: '((navigator.plugins.length>0&&typeof navigator.plugins["Shockwave Flash"]!=="undefined")?navigator.plugins["Shockwave Flash"].description.match(\/\\d+\/g).join("."):(typeof ActiveXObject!=="undefined")?new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version").match(\/\\d+\/g).join("."):"NA")' };
    	cookieValues.prototype.values['OS'] = { once: true, result: '', value: 'navigator.oscpu' };
    	cookieValues.prototype.values['Browser'] = { once: true, result: '', value: 'self.browserInfo()' };
    	cookieValues.prototype.values['Locale'] = { once: true, result: '', value: 'navigator.browserLanguage||navigator.language' };
    	cookieValues.prototype.values['URL'] = { once: true, result: '', value: 'document.URL' };
    	//cookieValues.prototype.values['Terms'] = { once: true, result: '', value: '(typeof(track) !== "undefined" && track.searchTerm) ? track.searchTerm : ""' };
    	//cookieValues.prototype.values['Site'] = { once: true, result: '', value: 'document.location.hostname' };
    	//cookieValues.prototype.values['Referrer'] = { once: true, result: '', value: 'document.referrer' };
    	cookieValues.prototype.values['Memberid'] = { once: false, result: '', value: 'self.memberId()' };
    	cookieValues.prototype.values['ServiceOrder'] = { once: false, result: '', value: 'self.serviceOrder()' };
    	cookieValues.prototype.values['PageViews'] = { once: false, result: '', value: 'self.pageViews()' };
    	cookieValues.prototype.values['Date'] = { once: true, result: '', value: 'self.getDate()' };
    	//cookieValues.prototype.values['LastTime'] = { once: false, result: '', value: 'self.lastTime()' };


    	cookieValues.prototype.lastTime = function () {
    		return '';
    	};

    	cookieValues.prototype.getDate = function () {
    		var date = new Date();
    		return date.toUTCString();
    	};

    	cookieValues.prototype.pageViews = function () {
    		var self = this;
    		var currentCount = 1;
    		var pageViews = self.values['PageViews'];
    		if (pageViews.result.length > 0) {
    			currentCount = parseInt(pageViews.result) + 1;
    		}

    		return currentCount;
    	};

    	cookieValues.prototype.serviceOrder = function () {
    		var self = this;
    		var currentVal = self.values['ServiceOrder'].result;

    		var queryStringVars = location.search.replace(/^\?/, '').split('&');
    		for (var i = 0; i < queryStringVars.length; i++) {
    			var queryName = queryStringVars[i].split('=')[0];
    			if (queryName == 'serviceOrderNumber') {
    				var queryValue = queryStringVars[i].split('=')[1];
    				return queryValue;
    			}
    		}

    		if (currentVal.length > 0)
    			return currentVal;

    		return '';
    	};

    	cookieValues.prototype.memberId = function () {
    		var self = this;
    		var currentVal = self.values['Memberid'].result;

    		var inputFields = document.getElementsByTagName('input');
    		for (var i = 0; i < inputFields.length; i++) {
    			var name = inputFields[i].name;
    			if (name == null)
    				continue;

    			if (name.indexOf('$hidMemAccountId') > -1) {
    				return inputFields[i].value;
    			}
    		}

    		if (currentVal.length > 0)
    			return currentVal;

    		return '';
    	};

    	cookieValues.prototype.browserInfo = function () {
    		var nAgt = navigator.userAgent,
			browserName = navigator.appName,
			fullVersion = String() + parseFloat(navigator.appVersion),
			majorVersion = parseInt(navigator.appVersion, 10),
			nameOffset,
			verOffset,
			ix;

    		// In Opera, the true version is after "Opera" or after "Version"
    		if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
    			browserName = 'Opera';
    			fullVersion = nAgt.substring(verOffset + 6);
    			if ((verOffset = nAgt.indexOf('Version')) !== -1) {
    				fullVersion = nAgt.substring(verOffset + 8);
    			}
    		} else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) { // In MSIE, the true version is after "MSIE" in userAgent
    			browserName = 'Microsoft Internet Explorer';
    			fullVersion = nAgt.substring(verOffset + 5);
    		} else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) { // In Chrome, the true version is after "Chrome"
    			browserName = 'Chrome';
    			fullVersion = nAgt.substring(verOffset + 7);
    		} else if ((verOffset = nAgt.indexOf('Safari')) !== -1) { // In Safari, the true version is after "Safari" or after "Version"
    			browserName = 'Safari';
    			fullVersion = nAgt.substring(verOffset + 7);
    			if ((verOffset = nAgt.indexOf('Version')) !== -1) {
    				fullVersion = nAgt.substring(verOffset + 8);
    			}
    		} else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) { // In Firefox, the true version is after "Firefox"
    			browserName = 'Firefox';
    			fullVersion = nAgt.substring(verOffset + 8);
    		} else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) { // In most other browsers, "name/version" is at the end of userAgent
    			browserName = nAgt.substring(nameOffset, verOffset);
    			fullVersion = nAgt.substring(verOffset + 1);
    			if (browserName.toLowerCase() === browserName.toUpperCase()) {
    				browserName = navigator.appName;
    			}
    		}
    		// trim the fullVersion string at semicolon/space if present
    		if ((ix = fullVersion.indexOf(';')) !== -1) {
    			fullVersion = fullVersion.substring(0, ix);
    		}
    		if ((ix = fullVersion.indexOf(' ')) !== -1) {
    			fullVersion = fullVersion.substring(0, ix);
    		}
    		majorVersion = parseInt(String() + fullVersion, 10);
    		if (isNaN(majorVersion)) {
    			fullVersion = String() + parseFloat(navigator.appVersion);
    			majorVersion = parseInt(navigator.appVersion, 10);
    		}

    		return browserName + " " + fullVersion;

    	};

    	return cookieValues;
    }
);

} (nerdsNgeeks));