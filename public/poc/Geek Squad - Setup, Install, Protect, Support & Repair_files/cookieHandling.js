/* -------------------------------------------------
 Cookie Handling Functions

 Target Browsers: IE7, IE8, IE9, Chrome, Firefox,
 Safari
 Authors: Mark Spooner
 --------------------------------------------------*/
(function (context) {

    context.define (
    [
        '/csi-survey/csiassets/scripts/models/globalJSVariables.js'
    ],
    function(globalVariables) {
        'use strict';
        //Constructor
        var cookieHandling = function() {
            var self = this;
            self.globalVars = new globalVariables();
        };
        /*
         *   This tests to see if the user agent
         *   is a mobile browser.  If so it sets a
         *   boolean value.
         */
        cookieHandling.prototype = {

            setShortCookie: function() {
                var self = this;
                var theDate = new Date();
                var soon = new Date(theDate.getFullYear(), theDate.getMonth(), theDate.getDate(), theDate.getHours(), theDate.getMinutes(), theDate.getSeconds()+5, theDate.getMilliseconds());
                var expires = soon.toGMTString();
                var cookieData;
                var tmp;
                if(document.getElementById('js-survey-tracking-number')) {
                    cookieData = document.getElementById('js-survey-tracking-number').innerHTML;
                    tmp = document.createElement('div');
                    tmp.innerHTML = cookieData;
                    if(tmp.innerText) {
                        tmp = tmp.innerText.replace(/\s + /g, '');
                    } else {
                        tmp = tmp.textContent.replace(/\s + /g, '');
                    }
                } else {
                    tmp = 0;
                }
                document.cookie = 'short_cookie=' + tmp + '; expires=' + expires + '; domain=.' + self.globalVars.variables().topLevelDomain + '; path=/';
            },

            setYesCookie: function(value) {
				var self = this;
				document.cookie = 'yes_cookie=' + escape(value) + '; domain=.' + self.globalVars.variables().topLevelDomain + '; path=/';
            },

            setLongCookie: function(value) {
                var self = this;
                var waitTime = self.globalVars.variables().cookieLength;
                var theDate = new Date();
                var expireDate = new Date(theDate.getFullYear(), theDate.getMonth(), theDate.getDate()+waitTime, 23, 59, 59);
                var expires = expireDate.toGMTString();
                document.cookie = 'long_cookie=' + escape(value) + '; expires=' + expires + '; domain=.' + self.globalVars.variables().topLevelDomain + ';  path=/';
            },

            getCookie: function(cookieCheck) {
                if(document.cookie.length > 0) {
                    var cookieTest = false;
                    var cookieName;
                    var cookieList;
                    var cookieType = 0;
                    var cookies = document.cookie;
                    for (var i=0; i < cookies.length; i++) {
                        cookieName = cookies.split('; ');
                    }

                    for(var i=0; i < cookieName.length; i++) {
                        cookieList = cookieName[i].substr(0, cookieName[i].indexOf('='));
                        if (cookieList === cookieCheck) {
                            cookieType = cookieList;
                        }
                    }

                    if (cookieType === cookieCheck) {
                        cookieTest = true; // TODO: change to true
                    }
                    return cookieTest;
                }
            },
			
			getCookieValue: function(cookieName) {
                var cookieValue = document.cookie;
				var cookieStart = cookieValue.indexOf(" " + cookieName + "=");
				if (cookieStart == -1){
					cookieStart = cookieValue.indexOf(cookieName + "=");
				}
				
				if (cookieStart == -1){
					cookieValue = null;
				}
				else{
					cookieStart = cookieValue.indexOf("=", cookieStart) + 1;
					var cookieEnd = cookieValue.indexOf(";", cookieStart);
					if (cookieEnd == -1){
						cookieEnd = cookieValue.length;
					}
					
					cookieValue = unescape(cookieValue.substring(cookieStart,cookieEnd));
				}
				
				return cookieValue;
            },
			
			setCookieValue: function(cookieName,value,exdays){
				var self = this;
				var exdate=new Date();
				exdate.setDate(exdate.getDate() + exdays);
				var cookieValue=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString()) + '; domain=.' + self.globalVars.variables().topLevelDomain + ';  path=/';
				document.cookie=cookieName + "=" + cookieValue;
			},

            getCookieData: function() {
				var cookieName;
				var cookieData = '';
				var cookieSplit;
                if(document.cookie.length  > 0){
					var cookies = document.cookie.split('; ');
					for (var i=0; i < cookies.length; i++) {
						cookieSplit = cookies[i].split('=');
						cookieName = cookieSplit[0];
						if(cookieName == 'short_cookie'){
							cookieData = cookies[i].substring('short_cookie='.length);
							break;
						}
					}
				}
				return cookieData;
            }
        };
        return cookieHandling;
    }
);


}(nerdsNgeeks));
 