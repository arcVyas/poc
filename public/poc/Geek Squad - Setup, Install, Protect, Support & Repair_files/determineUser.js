/* -------------------------------------------------
 Determine User JS

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
        var userDetermination = function() {
            var self = this;
            self.globalVars = new globalVariables();
        };
        /*
         *
         *   This sets up the chance that a user
         *   has to win.  They have to meet or be
         *   less than the chance (expressed in
         *   decimal).
         *
         */
        userDetermination.prototype.determineValidUser = function() {
            var self = this;
            var isUserValid = false;
            var setChance = self.globalVars.variables().userRate;
            var chance = Math.random();

            if(chance < setChance) {
                isUserValid = true;
            }

            return isUserValid;
        };
        return userDetermination;
    }
);

}(nerdsNgeeks));
 