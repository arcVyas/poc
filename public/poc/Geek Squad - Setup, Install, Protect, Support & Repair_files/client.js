/* -------------------------------------------------
 Client Window JS

 Target Browsers: IE7, IE8, IE9, Chrome, Firefox,
 Safari
 Authors: Mark Spooner
 --------------------------------------------------*/
 (function (context) {
    context.require (
    [
        '/csi-survey/csiassets/scripts/libs/domready.js',
        '/csi-survey/csiassets/scripts/models/mobileDetection.js',
        '/csi-survey/csiassets/scripts/models/cookieHandling.js',
        '/csi-survey/csiassets/scripts/models/determineUser.js',
        '/csi-survey/csiassets/scripts/views/modalFunctionality.js',
        '/csi-survey/csiassets/scripts/models/globalJSVariables.js',
		'/csi-survey/csiassets/scripts/models/cookieValues.js'
    ],
    function(domGetReady, mobileDetection, cookieHandling, determineIfUser, modalFunctionality, globalJSVariables, cookieValues) {
        'use strict';
        domGetReady(function() {
            var mobile = new mobileDetection();
            var cookies = new cookieHandling();
            var user = new determineIfUser();
            var modal = new modalFunctionality();
            var variables = new globalJSVariables();
			var values = new cookieValues();
			//var encoder = new base64();

            var yesCookie = 'yes_cookie';
            var longCookie = 'long_cookie';
            var shortCookie = 'short_cookie';

            var globalVariables = variables.variables();

			var longCookieValue = cookies.getCookieValue(longCookie);
			// Check if the user has already taken the survey
			if(longCookieValue != null && longCookieValue == 1){
				return false;
			}
			
            if(cookies.getCookieValue(yesCookie) != null) {
                values.init();
            } else {
                if(mobile.testBrowserAgent() !== globalVariables.mobileEnabled) {
                    return false;
                } else {
                    if(longCookieValue == null && user.determineValidUser()) {
						modal.displayModal(function() {
							var newWindow = window.open('/csi-survey/survey-window.html', 'watch', 'width=800,height=600,modal=yes,alwaysRaised=yes,scrollbars=yes,resizable=yes');
							cookies.setYesCookie('');
							values.init();
							return newWindow;
						}); 
						
						cookies.setLongCookie(0);
					}
					else{
						return false;
					}
                }
            }
        });
    }
);

}(nerdsNgeeks));
