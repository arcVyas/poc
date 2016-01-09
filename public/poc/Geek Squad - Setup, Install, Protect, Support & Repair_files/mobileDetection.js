/* -------------------------------------------------
 Mobile Detection

 Target Browsers: IE7, IE8, IE9, Chrome, Firefox,
 Safari
 Authors: Mark Spooner
 --------------------------------------------------*/
(function (context) {

    context.define (
    [
    ],
    function() {
        'use strict';
        //Constructor
        var mobileBrowserTest = function() {};
        /*
         *
         *   This tests to see if the user agent
         *   is a mobile browser or not and
         *   sets a boolean.
         *
         */
        mobileBrowserTest.prototype.testBrowserAgent = function() {
            var isMobile = false;

            if( navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/webOs/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                ) {
                isMobile = true;
            }

            return isMobile;
        };
        return mobileBrowserTest;
    }
);


}(nerdsNgeeks));
 