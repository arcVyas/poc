/* -------------------------------------------------
 Modal Functionality JS

 Target Browsers: IE7, IE8, IE9, Chrome, Firefox,
 Safari
 Authors: Mark Spooner
 --------------------------------------------------*/
(function (context) {

	context.define(
    [
        '/csi-survey/csiassets/scripts/models/globalJSVariables.js',
		'/csi-survey/csiassets/scripts/models/cookieHandling.js'
    ],
    function (globalVariables, cookieHandling) {
    	'use strict';
    	//Constructor
    	var createModal = function () {
    		var self = this;
    		self.globalVars = new globalVariables();
    		self.cookies = new cookieHandling();
    	};
    	/*
    	*
    	*   This builds the modal and overlay
    	*   and displays it, and attaches the
    	*   CSS file necessary to style it.
    	*   It is also set up to pull in
    	*   html pages to populate the modal.
    	*
    	*/
    	createModal.prototype = {
    		displayModal: function (callback) {
    			var self = this;
    			this.attachCSSFile();
    			this.addModalOverlay();
    			this.createModalFrame();
    			this.addModalContent(function () {
    				self.setUpCloseButton();
    				document.getElementById('js-survey-yes').onclick = function () {
    					callback();
    				};
    			});
    		},

    		attachCSSFile: function () {
    			var CSSFile = document.createElement('link');
    			CSSFile.setAttribute('rel', 'stylesheet');
    			CSSFile.setAttribute('type', 'text/css');
    			CSSFile.setAttribute('href', '/csi-survey/csiassets/styles/modal.css');
    			document.getElementsByTagName('head')[0].appendChild(CSSFile);
    		},

    		addModalOverlay: function () {
    			var overlayElement = document.createElement('div');
    			overlayElement.className += 'modal-overlay';
    			overlayElement.id += 'js-survey-modal-overlay-wrapper';
    			document.body.appendChild(overlayElement);
    		},

    		createModalFrame: function () {
    			var outerFrame = document.createElement('div');
    			outerFrame.id += 'js-survey-modal-wrapper';
    			outerFrame.className += 'modal-wrapper';
    			document.body.appendChild(outerFrame);
    		},

    		/*
    		*
    		*   This pulls in the type of modal and populates
    		*   the modal container. So it can be any markup
    		*   needed.
    		*
    		*/

    		addModalContent: function (callback) {
    			var self = this;
    			var modalType = self.globalVars.variables().modalType;
    			var xmlhttp = new XMLHttpRequest();
    			xmlhttp.onreadystatechange = function () {
    				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    					document.getElementById("js-survey-modal-wrapper").innerHTML = xmlhttp.responseText;
    					callback();
    				}
    			};
    			xmlhttp.open("GET", modalType, true);
    			xmlhttp.send();
    		},

    		setUpCloseButton: function () {
    			var self = this;
    			var surveyButtons = document.getElementsByTagName('button');
    			for (var i = 0; i < surveyButtons.length; i++) {
    				if ((' ' + surveyButtons[i].className + ' ').indexOf(' js-survey-close ') > -1) {
    					if (surveyButtons[i].addEventListener) {
    						surveyButtons[i].addEventListener('click', function () {
    							self.removeModal();
    						});
    					} else {
    						surveyButtons[i].attachEvent('onclick', function () {
    							self.removeModal();
    						});
    					}
    				}
    			}
    		},

    		removeModal: function () {
    			var overlay = document.getElementById('js-survey-modal-overlay-wrapper');
    			var modal = document.getElementById('js-survey-modal-wrapper');
    			var cssFiles = document.getElementsByTagName('head')[0].getElementsByTagName('link').length;
    			var css =  document.getElementsByTagName('head')[0].getElementsByTagName('link')[cssFiles - 1];

    			document.getElementsByTagName('head')[0].removeChild(css);
    			document.body.removeChild(modal);
    			document.body.removeChild(overlay);
    		}
    	};
    	return createModal;
    }
);


} (nerdsNgeeks));
 