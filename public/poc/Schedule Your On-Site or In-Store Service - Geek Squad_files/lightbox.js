/*
 * Copyright 2013 TimeTrade Systems Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
 /**
 * Embeddable Lightbox / Iframe
 *
 * A centered, lightboxed iframe, with no library dependencies.
 *
 * @version 1.2
 */
  
(function() {

	var tt = {
	
	destroy: function (el) { if(el.parentNode){ el.parentNode.removeChild(el);}},
	
	hitch: function (obj, methodName) { return function() { obj[methodName].apply(obj, arguments); };},
		
	loader_url: "//cdn.timetrade.com/images/misc/1.0/large_loading.gif",


	launchWorkflow: function(t){
		var w = parseInt(t.getAttribute("data-lightbox-width")) || 762;
		var h = parseInt(t.getAttribute("data-lightbox-height")) || 583;
		var topMgn = 20, pad = 3, brdW = 1;
		var vpDetect = t.getAttribute("data-vp-height-detection") != "false" ? true : false;
		var loader_msg = t.getAttribute("data-lightbox-loading-message") || "";
		var d = document, b = d.body, n = navigator;
		b.style.overflow = "hidden";
		
		var isGteIE9 = function() { return XDomainRequest && window.performance; };
		var msIE = "Microsoft Internet Explorer";
		var isIE = n.appName == msIE;
		//This is the best we can possibly do to detect a touch device, that has one touch property, has a screen position of 0 (upper left) and has a resolution under 1500. 
		var isTouchDevice = function() { return ( ('ontouchstart' in window && window.screenX == 0) || window.navigator.msMaxTouchPoints ) && screen.width < 1500 ? true : false; };
		var url = t.href;
		
		/* Under mobile launch new window (return true) */
		var isDesktop = !isTouchDevice();
		var vpel = d.compatMode === "CSS1Compat" ?  d.documentElement : b;
		var totalLbHght = h + topMgn + (pad * 2 ) + (brdW * 2);
		var isVpHeightGtH = vpel.clientHeight > totalLbHght && vpDetect ? true : false;
		
		if (isIE){
			var isLtIe9Mode = isGteIE9() && d.documentMode < 9 ? true : false; //We are IE9 or higher running in IE8 or less mode.
		}
		
		var viewP = "view=", embedParam = viewP+"embed", htmlParam = viewP+"full", viewR = new RegExp('&?' +embedParam +'+');
		if(!isDesktop || !isVpHeightGtH || isLtIe9Mode){
			t.href = t.href.replace(viewR, "");
			return true;
		}
		
		var autoAppendEmbed = (url.indexOf(embedParam) === -1 && url.indexOf(htmlParam) === -1) ? true : false; //no embed param already, and no html param? Default to auto appending.
		if(autoAppendEmbed) {
			var p = "?";
			if(url.indexOf(p) !== -1){
			 p = "&";
			}
			url += p + embedParam;
		}
		var styleMe = function(el, obj){for(var i in obj){el.style[i] = obj[i];}return el;};
		var u = { position: "fixed", width: "100%", height: "100%", backgroundColor: "#463E3F", left: "0", top: "0", zIndex: "2999", "-moz-opacity":0.5, opacity: ".50", filter: "alpha(opacity=50)" };
		var cr = { width: w + "px", height: h + "px", position: "fixed", zIndex: "3001", bottom: "0", left: "50%", top: topMgn + "px", margin: "0 0 0 -" + w  / 2 + "px", backgroundColor: "white", border: brdW + "px solid black", padding: pad + "px", "-moz-border-radius": "6px", "borderRadius": "6px", boxShadow: "0 3px 7px black" };
		var i = { width: w + "px", height: h + "px", position: "relative", zIndex: "3002", border: "none" };
		var msgBox = { width: w + "px", height: h + "px", position: "fixed", zIndex: "3003", left: "50%", top: topMgn + "px", margin: "0 0 0 -" + w  / 2 + "px", display: "table-cell", "vertical-align": "middle", "text-align": "center", background: "url("+document.location.protocol+this.loader_url+") center center no-repeat" };
		var msgBoxInnards = { width: "350px", "fontFamily": "'Helvetica Neue', Arial, sans-serif", "textAlign": "center", position: "relative", "top": "55%", margin: "0 auto 0 auto" };
		var cl = { position: "fixed", zIndex: "4000", left: "51%", top: "10px", "marginLeft": (w /2)-20+"px", color: "white", fontSize: "19px", fontFamily: "times", textIndent: "5px", borderRadius: "50%", width: "20px", height: "20px", lineHeight: "19px", background: "black", color: "white", border: "2px solid white", boxShadow: "0 0 4px black"   };  
		
		if (isIE){
			cl.fontWeight = "bold";
			cl.fontSize = "20px";
			cl.textIndent = "4px";
		}
		
		var uEl = styleMe(d.createElement("div"), u);
		b.insertBefore(uEl, b.firstChild);
		var crEl = styleMe(d.createElement("div"), cr);
		var frame = d.createElement("iframe");
		frame.frameBorder = "0";
		frame.scrolling = "no";
		var iEl = styleMe(frame, i);
		iEl.src = url;
		if(iEl.attachEvent){
			iEl.attachEvent('onload', this.hitch(this, "destroyMsgEls") );
		} else {
			iEl.onload = this.hitch(this, "destroyMsgEls");
		}
		crEl.appendChild(iEl);
		
		var msgEl = styleMe(d.createElement("div"), msgBox);
		var msgIEl = styleMe(d.createElement("div"), msgBoxInnards);
		msgIEl.innerHTML = loader_msg;
		msgEl.appendChild(msgIEl);
		crEl.appendChild(msgEl);
		this.msgEls = [ msgEl ];
		b.appendChild(crEl);
		this.els = [ uEl, iEl, crEl ];
		/* now create x */
		if(!this.clse){
			var clse = d.createElement("a");
			clse.innerHTML = "&times;";
			clse.style.textDecoration = "none";
			clse.onclick = this.hitch(this, "destroyDialog");
			clse.href = "javascript: void(0)";
			b.appendChild(styleMe(clse, cl));
			this.els.push(clse);
			this.clse = clse;
		}
		document.onkeydown = this.hitch(this, "destroyOnKey");
		return false;
	},
	
	destroyOnKey: function(evt) {
	    evt = evt || window.event;
	    if (evt.keyCode == 27) {
	        this.destroyDialog();
	    }
	},
		
	destroyDialog: function(){
		var d = document;
		d.onkeydown = null;
		for(var i in this.els){
			this.destroy(this.els[i]);
		}
		delete this.clse;
		d.body.style.overflow = "";
	},
	
	destroyMsgEls: function(){
		for(var i in this.msgEls){
			this.destroy(this.msgEls[i]);
		}
	}
	
	}; //end tt
	//init
	var l = new Image();
	l.src = document.location.protocol + tt.loader_url;
	window.tt = tt;
})();