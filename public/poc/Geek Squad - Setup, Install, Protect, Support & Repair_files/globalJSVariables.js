/* -------------------------------------------------
 Global Variables

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
        var globalVars = function() {};

        globalVars.prototype = {

            variables: function() {

                /*
                *
                *   These variables control various
                *   JavaScript aspects.
                *
                */

                var JSVariables = {
                        'mobileEnabled': false,
                        'cookieLength': 90,
                        'userRate': .2,
                        'destination': 'http://survey.confirmit.com/wix2/p2077087653.aspx',
                        'modalType': '/csi-survey/modal-content.html',
                        'topLevelDomain': window.csiSurveyDomain,
						'cookieSeparator': '#$#',
						'valueSeparator': '##'
                    };
                return JSVariables;
            }
        };
        return globalVars;
    }
);

}(nerdsNgeeks));
 