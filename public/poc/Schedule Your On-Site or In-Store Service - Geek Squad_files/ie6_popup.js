	    var BrowserDetect = {
                init: function () {
                    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
                    this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
                    this.OS = this.searchString(this.dataOS) || "an unknown OS";
                },
                searchString: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var dataString = data[i].string;
                        var dataProp = data[i].prop;
                        this.versionSearchString = data[i].versionSearch || data[i].identity;
                        if (dataString) {
                            if (dataString.indexOf(data[i].subString) != -1)
                                return data[i].identity;
                        }
                        else if (dataProp)
                            return data[i].identity;
                    }
                },
                searchVersion: function (dataString) {
                    var index = dataString.indexOf(this.versionSearchString);
                    if (index == -1) return;
                    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
                },
                dataBrowser: [
		{
		    string: navigator.userAgent,
		    subString: "Chrome",
		    identity: "Chrome"
		},
		{ string: navigator.userAgent,
		    subString: "OmniWeb",
		    versionSearch: "OmniWeb/",
		    identity: "OmniWeb"
		},
		{
		    string: navigator.vendor,
		    subString: "Apple",
		    identity: "Safari",
		    versionSearch: "Version"
		},
		{
		    prop: window.opera,
		    identity: "Opera"
		},
		{
		    string: navigator.vendor,
		    subString: "iCab",
		    identity: "iCab"
		},
		{
		    string: navigator.vendor,
		    subString: "KDE",
		    identity: "Konqueror"
		},
		{
		    string: navigator.userAgent,
		    subString: "Firefox",
		    identity: "Firefox"
		},
		{
		    string: navigator.vendor,
		    subString: "Camino",
		    identity: "Camino"
		},
		{		// for newer Netscapes (6+)
		    string: navigator.userAgent,
		    subString: "Netscape",
		    identity: "Netscape"
		},
		{
		    string: navigator.userAgent,
		    subString: "MSIE",
		    identity: "Explorer",
		    versionSearch: "MSIE"
		},
		{
		    string: navigator.userAgent,
		    subString: "Gecko",
		    identity: "Mozilla",
		    versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
		    string: navigator.userAgent,
		    subString: "Mozilla",
		    identity: "Netscape",
		    versionSearch: "Mozilla"
		}
	],
                dataOS: [
		{
		    string: navigator.platform,
		    subString: "Win",
		    identity: "Windows"
		},
		{
		    string: navigator.platform,
		    subString: "Mac",
		    identity: "Mac"
		},
		{
		    string: navigator.userAgent,
		    subString: "iPhone",
		    identity: "iPhone/iPod"
		},
		{
		    string: navigator.platform,
		    subString: "Linux",
		    identity: "Linux"
		}
	]

            };
            BrowserDetect.init();

            $(function () {
                var ac = document.cookie;

                var ignoreBrowerCheck = false;
                if (/chat-with-an-agent/.test(document.location.pathname)
					&& /(Windows NT 5.1|Windows XP)/.test(navigator.userAgent)
					&& /gs_xpUpgrade=/.test(ac) == false) {

                    ignoreBrowerCheck = true;

                    $('#xpModalBlocker, #xpModal, #xpModalClose, #xpModalContainer').css({ 'display': 'block' });
                    $('#xpModal').css('opacity', 1);
                    $('#xpModalBlocker').animate({ 'opacity': .6 }, 800);

                    $('#xpModalClose, #xpCloseWindowButton, #xpModalBlocker').click(function (e) {
                        e.preventDefault();
                        setCookieXP();
                        restoreToGSXP();
                    });
                }

                if (!ignoreBrowerCheck && BrowserDetect.browser == "Explorer" && BrowserDetect.version < 8 && ac.indexOf('gs_ieUpgrade=') == -1) {
            		if (navigator.userAgent.indexOf('Trident') == -1) {
						$('#ie6ModalBlocker, #ie6Modal, #ieModalClose, #ieModalContainer').css({ 'display': 'block' });
            			$('#ie6Modal').css('opacity', 1);
            			$('#ie6ModalBlocker').animate({ 'opacity': .6 }, 800);

            			$('#ieModalClose, #ie6CloseWindowButton, #ie6ModalBlocker').click(function (e) {
            				e.preventDefault();
            				setCookie();
            				restoreToGS();
            			});
            		}
            	}
            });
            function restoreToGSXP() {
                $('#xpModalBlocker, #xpModal, #xpModalClose, #xpModalContainer').css({ 'display': 'none' });
            }
            function setCookieXP() {
                var dt = new Date();
                dt.setDate(dt.getDate() + 7);
                var c = 'gs_xpUpgrade=declined; expires=' + dt.toUTCString();
                document.cookie = c;
            }
            function restoreToGS() {
                $('#ie6ModalBlocker, #ie6Modal, #ieModalClose, #ieModalContainer').css({ 'display': 'none' });
            }
            function setCookie()
            {
                var dt = new Date();
                dt.setDate(dt.getDate() + 7);
                var c = 'gs_ieUpgrade=declined; expires=' + dt.toUTCString();
                document.cookie = c;
            }
