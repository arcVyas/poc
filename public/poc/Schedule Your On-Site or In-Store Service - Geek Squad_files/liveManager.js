/***
 * liveManager
 * Version @version@
 * Copyright (c) 2010 Best Buy (BBY).  All rights reserved.
 *
 * A utility script for controlling when other javascript scripts are loaded on the page.
 * The script can delay loading of a script until the footer of the page is loaded.
 *
 */

var Lm = {
  q:{}, // Todo: define
  l:[], // The queue of scripts loaded or to be loaded on the page.  Queue is filled by Function A and consumed by function LOAD.
  f:{}, // Todo: define
  p:0,  // Todo: define..  Number representing current script to load?  
  o:0,  // Todo: define..  Constant representing 0?
  h:location.hostname,
  /***
   * Function A - Load or Queue Scripts
   *
   * Either add object with script metadata (a) to Lm.l or create a script object on the DOM right away based on the boolean value of a.c.
   *
   * @param a - a passed in object that holds metadata for the script to be loaded.
   *        a.a - Script Name
   *        a.b - Script URI/Location
   *        a.c - When to load  (0 - load now, 1 - Queue)
   *        a.d - not used by this function (contains script to be eval'd after script loads and callsback).
   *        a.e - Code to eval before the "script" is added to the page
   * 
   */
  A:function(a) {  
    var b, c, d;
	if (a.c) this.l.push(a); // Boolean evaluation.  If a.c is 1 (True) then queue load request.
    if (this.config.load[a.a]) { // Boolean evaluation.  Script name (a.a) has to be in the Lm.config object (and set to 1/true) or don't load.
      b = document;
      if (b.createElement) { // Ensuring we have a well-formed document object?
        c = "Lm_" + a.a;
        if (!b.getElementById(c)) { // If element is not already there we're going to create it.
          if (typeof a.e !== "undefined") {
            try {
                eval(a.e); // Things to eval before the "script" loads
            } catch(e) {
              Lm.ONERROR("liveManager.A: Failed to eval: " + a.e, "", e);
            }
          }
          // Creates script object
          d = b.createElement('script');
          d.language = 'javascript';
          d.type = 'text/javascript';
          d.src = a.b;
          d.id = c;
          b.getElementsByTagName("head")[0].appendChild(d); // Add script to head element of the page
        }
      }
    }
  },
  /***
   * Function LOAD - Callback for scripts called after by external scripts after they load -- via Lm.LOAD("scriptName").
   *
   * @param a - The name of the script that is calling back
   */
  LOAD:function(a) { 
    var b, c, d;
	this.f[a] = 0; // Todo: Should this be 'this' or 'Lm'?
    c = this.l.length;
    for (b = this.p; b < c; b++) { // Iterate from current position to the end of the queue.  Todo refactor: implement a FIFO shift, and get rid of 'p'?
      d = this.l[b];  // this is the object that was queued by the A function (earlier)
      if (this.f[d.a] == 0) {
        this.f[d.a] = ++this.p; // increment current position in the list.
        if (typeof d.d !== "undefined") {
          try {
            eval(d.d); // Things to eval now that the script (a) has loaded.
          } catch(e) {
            Lm.ONERROR("liveManager.LOAD: Failed to eval: " + d.d, "", e);
          }
        }
      } else return;
    }
    if (this.p == c && this.o == 0)this.o = 1;
  },
  /***
   * Function EV - Add EventListner
   * @param a - Element
   * @param b - Event
   * @param c - Function/Callback
   * @param d - if d is 1, then instrument element with "on"+event (IE specific)?
   */
  EV:function(a, b, c, d) {
    if (a.addEventListener) {
      a.addEventListener(b, c, false);
    } else if (a.attachEvent) {
      a.attachEvent(((d == 1) ? "" : "on") + b, c);
    }
  }};

Lm.config = { // Load and configuration object
  domain:".geeksquad.com",
  sc_acct:"bbygsmainprod",
  //sc_kiosk:"bbykioskprod",
  //sc_esp:"bbyspanishprod",
  sc_acctdev:"bbygsmaindev",
  //sc_kioskdev:"bbykioskdev",
  //sc_espdev:"bbyspanishdev",
  dev:'0',//dev:"@devBit@",
  ga_acct : "UA-6804456-1",
  visitorNamespace: "geeksquad",
  linkInternalFilters : "javascript:,geeksquad.com",
  trackingServer:"metrics.geeksquad.com",
  trackingServerSecure:"smetrics.geeksquad.com",
  load:{trackEventCustom:1,trackEvent:1,s_code:1,atlas:0,alvenda:0,foreseeTrigger:0,rm:0,ace:0,cj:0,cnet:0,ci:0,tapestry:0,bing:0}
};
Lm.lc=201009171521;//Lm.lc = "@version@"; // Version for cache busting
Lm.pre = "/scripts/tracking/"; // relative URI for scripts
/*Lm.localPre = "//images.qa.bestbuy.com/BestBuy_US/js/tracking/";
if (Lm.config.dev == '0') { // Dev bit test
  Lm.pre = (location.protocol == "http:") ? "//images.bestbuy.com/BestBuy_US/js/tracking/" : "//images-ssl.bestbuy.com/BestBuy_US/js/tracking/";
  Lm.localPre = (location.protocol == "http:") ? "//images.bestbuy.com/BestBuy_US/js/tracking/" : "//images-ssl.bestbuy.com/BestBuy_US/js/tracking/";
}*/

/*if (typeof track.catId != "undefined") {
  if (track.catId == "pcat17014") {  // pcat17014 is the Thank You page of the Cart.
    Lm.A({a:"alvenda",b:Lm.pre + "alvenda-min.js?v=" + Lm.lc,c:1,d:"Lm.alvenda.INIT(track);"}); // Alvenda
    Lm.A({a:"cj",b:Lm.pre + "cj-min.js?v=" + Lm.lc,c:1,d:"Lm.cj.INIT(track);"}); // Commission Junction
    Lm.A({a:"bing",b:Lm.pre + "bing-min.js?v=" + Lm.lc,c:0}); // Todo: Does this mean do not load BING?
  }
}

if (typeof track.ea != "undefined") {
  Lm.A({a:"ace",b:Lm.pre + "ace-min.js?v=" + Lm.lc,c:1,d:"Lm.ace.INIT(track);"});
}*/

Lm.A({a:"s_code",b:Lm.pre + "s_code.js?v=" + Lm.lc,c:1}); // Omniture script
Lm.A({a:"trackEventCustom",b:Lm.pre + "trackEventCustom.js?v=" + Lm.lc,c:1});  // TrackEventCustom
Lm.A({a:"trackEvent",b:Lm.pre + "trackEventCore.js?v=" + Lm.lc,c:1,d:"trackEvent.INIT();trackEvent.event('event.view',track)",e:"trackEvent={event:function(a,b){Lm.q['trackEvent']={a:a,b:b}}}"});  // TrackEvent
/*Lm.A({a:"atlas",b:Lm.pre + "atlas-min.js?v=" + Lm.lc,c:0}); // Altas/Razorfish?
Lm.A({a:"cnet",b:Lm.pre + "cnet-min.js?v=" + Lm.lc,c:0}); // Cnet
Lm.A({a:"tapestry",b:Lm.pre + "tapestry-min.js?v=" + Lm.lc,c:0}); // Spanish version of site
Lm.A({a:"ci",b:Lm.pre + "ci-min.js?v=" + Lm.lc,c:0}); // Channel Intelligence

if (location.protocol != "https:")Lm.A({a:"rm",b:Lm.pre + "rm-min.js?v=" + Lm.lc,c:0});

Lm.esp = (Lm.h.indexOf('espanol.') > -1) ? "/enes" : "";
Lm.A({a:"foreseeTrigger",b:Lm.esp + "/fsrscripts/foresee-trigger.js?v=" + Lm.lc,c:0});  // foresee questionnaires
*/
Lm.ONLOAD = function() {
	/*if (typeof Lm.atlas != "undefined")Lm.atlas.INIT(track);
  if (typeof Lm.rm != "undefined")Lm.rm.INIT(track);
  if (typeof Lm.ace != "undefined")Lm.ace.SEND();
  if (typeof Lm.cnet != "undefined")Lm.cnet.INIT(track);
  if (typeof Lm.tapestry != "undefined")Lm.tapestry.INIT(track);
  if (typeof Lm.ci != "undefined")Lm.ci.INIT(track);
  if (typeof Lm.bing != "undefined")Lm.bing.INIT(track);*/
};
Lm.ONERROR = function(a, b, c) {
  if (Lm.erf != 1) {
    Lm.error = (typeof a == "string") ? (a + "-" + c) : "Unknown";
    Lm.erf = 1;
  }
};
Lm.EV(window, "load", Lm.ONLOAD, null);
Lm.EV(window, "error", Lm.ONERROR, null);
