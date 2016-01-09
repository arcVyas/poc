var trackEventCustom = {

	/***************************************************************************
	 * assorted variables
	 **************************************************************************/
	// the plugins array
	plugins : [],
	// the namespace used for writing cookies
	ns : "track",
	// token used for joining values
	tok : ": ",
	// the base values that are mapped as part of every call
	base : "page,section,catId,templateName",
	// constant for 'undefined'
	ud : "undefined",

	/***************************************************************************
	 * map the left side of the map represents the variable names that are
	 * passed in on the track object. the rigth side values are the variable
	 * names that will be passed to omniture.
	 * 
	 * the trackEvent process will create two internal objects from this map one
	 * that contains the left side variable names and the associated values (b
	 * object), and one that contains the right side variable names and the
	 * associated values (v object).
	 * 
	 * some map entries do not have a right side value. this is usually done
	 * because the value is needed for deriving other fields or continuing
	 * processing but is not needed to be sent to omniture.
	 * 
	 * there are a few naming conventions associated with the left side
	 * 
	 * qp.foo = eVar6- these represent values that are derived from the query
	 * paramaeters. the trackEvent code will automatically look for these values
	 * in the query string and map them accordingly. In this example the system
	 * would look for the value for "foo" and map it to qp.foo on the b object
	 * and to eVar6 on the v object
	 * 
	 * cp.foo = prop10 - these are similar to the qp variables but are for
	 * cookie values. The system will automatically interrogate the cookie for
	 * these values and map them accordingly. it looks for them on the cookie
	 * identified by the ns variable.
	 * 
	 * d_ - anything that is prefixed with a d_ is a derived field and is
	 * calculated as part of the execution of the plugins. this designation is
	 * for identification pruposes only and does not affect processing.
	 * 
	 * 
	 */
	map : {
		conversion : "events",
		errorEvent : "",

		page : "pageName",
		section : "hier1",
		uberCatId : "d_pageIds$0",
		uberCatName : "",
		parentCatId : "d_pageIds$1",
		parentCatName : "",
		catId : "d_pageIds$2",
		catName : "",
		templateName : "prop3",
		facetName : "",
		facetValue : "prop5,eVar5",
		hourOfDay : "prop6",
		inno : "eVar6",
		dayOfWeek : "prop7",
		recognized : "eVar8,prop8",
		flashVersion : "prop9",
		language : "prop10",
		lastPage : "",
		lastLink : "prop13",
		productTab : "prop14,eVar14",
		searchKey : "prop15,eVar15",
		searchTerm : "prop16,eVar16",
		searchResultsNum : "prop17",
		storeId : "",
		abTest : "prop20,eVar20",
		abTest2 : "prop40,eVar39",
		abTestCheckout : "prop20,eVar38",
		rzId : "prop21,eVar21",
		rzTier : "prop22,eVar22",
		errorCodeList : "prop25",
		failedSearchTerm : "prop26,eVar26",
		payTypeList : "eVar33",
		rating : "eVar35",
		skuId : "prop36",
		reviewsNum : "eVar37",
		lid : "link_name",
		lpos : "",
		jserror : "prop47",
		tltsid : "prop48",
		profileId : "prop49,eVar49",
		error : "",
		imperror : "prop50",
		video : "eVar34",
		outOfStock : "prop46",
		headerFooter : "prop29,eVar29",

		"qp.cmp" : "campaign",
		"qp.dcmp" : "campaign",
		"qp.ref" : "ref",
		"qp.loc" : "loc",
		"qp.usc" : "",
		"qp.icmp" : "eVar47",
		"qp.adgroupid" : "adgroupid",
		"qp.query" : "query",
		"qp.st" : "",
		"qp.searchterm" : "",
		"qp.searchresults" : "",
		"qp.list" : "",
		"qp._dynsessconf" : "",

		// cookie example set via trackEvent.event("event.cache",{lid:"lid
		// value"});
		"cp.inno" : "",
		"cp.lid" : "",
		"cp.lastPage" : "",
		"cp.finder" : "eVar45",

		d_pageIds : "prop1,eVar1",
		d_campaignPath : "prop23",
		d_campaignLatency : "prop24,eVar24",
		d_failedSearch : "event2",
		d_searchSynonym : "prop43,eVar43",
		d_product : "products",
		d_purchaseId : "purchaseID",
		d_uberCat : "channel",
		d_searchScope : "eVar46",
		d_category : "prop28",
		// d_merchCategory : "eVar1",
		priceList : "",
		qtyList : "",
		skuList : "",
		orderDiscAmt : "",
		orderShipAmt : "event4",// todo ???: Is this the right place for this?
		orderId : "prop33",
		orderState : "state",
		orderZip : "zip",
		activity : "",
		sysDate : ""
	},

	/**
	 * preprocess
	 * 
	 * this is the very first method that is called when the trackevent.event is called.  it allows
	 * for some preprocesing of the call before it is executed.  
	 * 
	 * @param evt - the name of the event that is being requested by the caller
	 * @param trackObj - the JSON object that was provided by the caller
	 * @return boolean - if the function returns false then the processing stops.  If it
	 * returns true then processing continues normally.
	 */
	preProcess : function(evt, trackObj) {
		return true;
	},

	/*******************************************************************************
	 * postProcessOmnitureObject
	 * 
	 * this is the final step before the data is sent to Omniture
	 * It is a final opportunity to manipulate the object that will be sent to Omniture
	 * 
	 * @param OmitureObject - the object that contains the data that will be sent to Omniture
	 * @return the return value is set to the Omniture object so this function must return the Omniture Object
	 */
	postProcessOmnitureObject : function(omnitureObj) {
		return omnitureObj;
	}
};

/*************************************************************
 * Plugin definitions
 * 
 * each plugin has a _I method and a _E method.  the _I method is called to initialize
 * the plugin and the _E funtion is called to execute the plugin.  if the plugin returns false
 * then execution is halted.  
 */

/**
 * SiteCatalyst Account determines which siteCatalyst account to use: kiosk or
 * default
 */
trackEventCustom.plugins[3] = {
	_I : function() {
	},
	_E : function(evt, trackObj) {
		var c, d, e, p;
		p = trackEvent; // trackEvent Object
		c = Lm.config;
		d = c.sc_acct;
		e = c.sc_acctdev;
		if (typeof trackObj.storeId != p.ud) {
			d = c.sc_kiosk;
			e = c.sc_kioskdev;
		}
		if (typeof location != p.ud && typeof location.hostname != p.ud
				&& location.hostname.indexOf("espanol") > -1) {
			d = d + "," + c.sc_esp;
			e = e + "," + c.sc_espdev;
		}
		d = (c.dev != '0') ? e : d;
		p.s_code.sa(d);
		return true;
	}
};

// SiteCatalyst Link Tracking
trackEventCustom.plugins[4] = {
	/*values added to the linktrack list should be comma separated and come from the left side fo the map.  
	 * These values will be sent along with the link tracking call to Omniture.
	 * e.g. adding "page" to the list will send the 'page' variable to Omniture along with the
	 * valid data.
	 */
		
		
	linktrack : "",
	_I : function() {
	},
	_E : function(evt, trackObj) {
		var c, d, e, p;
		p = trackEvent; // trackEvent Object
		if (evt == "event.link") {
			// should we iterate over the incoming object b and add
			// those names to the s.linkTrackEvents?

			c = this.linktrack.split(",");
			d = [];
			for (e in c) {
				if (typeof c[e] != "function") {
					s[p.map[c[e]]] = trackObj[c[e]];
					d.push(p.map[c[e]]);
				}
			}
			s.linkTrackVars = d.join(",");
			if (typeof trackObj.conversion != p.ud)
				s.linkTrackEvents = trackObj.conversion;
		}
		return true;
	}
};

/**
 * various functions that massage incoming data values
 */
trackEventCustom.plugins[5] = {
	_I : function() {
	},
	_E : function(a, b, c, d, e, p) {
		p = trackEvent; // trackEvent Object
		
	p.saveCookie("finder", "", "d");
	
	// toString and default values
	p.addToTrackObj('language',
			(document.getElementsByTagName("html")[0].lang == "es") ? "es"
					: "en");

	// remove unwanted USC character in actor, artist, title, etc
	if (typeof p.b["qp.usc"] != p.ud) {
		c = escape(p.b["qp.usc"]);
		p.addToTrackObj('qp.usc', unescape(c.replace("%A0-", "")));
		p.v[p.map["qp.usc"]] = p.b["qp.usc"];

		// derive searchScope
		p.addToTrackObj('d_searchScope',
				((typeof p.b["qp._dynsessconf"] != p.ud) ? "global:"
						: "category:")
						+ p.b["qp.usc"]);
	}

	// Internal Campaign Event
	if (typeof p.b["qp.icmp"] != p.ud)
		p.mapValues("conversion", "event16", "a");

	// TODO: incorporate the setting of the searchterm that is being done in
	// plugin 9 into this code
	// if the search term is the same as the cached searchter then this is
	// not the original search and should not be counted as a search successful
	// or otherwise.

	var h = p.getCookieObject();
	if (typeof b.catId != p.ud && b.catId == 'pcat17071') {
		// if the searchterm is the same as the previous search then the search
		// should not be
		// identified as successful or unsuccessful
		if (unescape(h.searchTerm) != b.searchTerm) {
			d = (typeof b.searchResultsNum != 'undefined') ? parseInt(b.searchResultsNum)
					: 0;

			if (d > 0) {
				// if this is synonym search then it is not considered a
				// successful or unsuccessful search
				e = (typeof p.b["qp.st"] != 'undefined') ? p.b["qp.st"] : '';
				if (e != '' && e.indexOf('_') < 0) {
					// successful search
					p.saveCookie("searchTerm", b.searchTerm);
					p.mapValues("conversion", "event1", "a");
				}
			} else {
				// unsuccessful search
				p.saveCookie("searchTerm", b.searchTerm);
				p.mapValues("conversion", "event2", "a");
			}
		}
	}
	// if the the resulting page is not pcat17071 and there is a searchterm and
	// searchresultsNum on the page
	// then it is a redirect and is still considered a successful search
	else if (typeof p.b["qp.searchresults"] != 'undefined'
			&& typeof p.b["qp.searchterm"] != 'undefined') {
		if (p.b["qp.searchterm"] != unescape(h.searchTerm)) {
			p.saveCookie("searchTerm", p.b["qp.searchterm"]);
			p.mapValues("conversion", "event1", "a");
			p.addToTrackObj('d_searchScope', 'redirect');
		}
	}

	// purchase id truncation to handle 20 chars or less - removing BBY01-
	if (typeof b.orderId != p.ud && b.orderId.length > 6)
		p.addToTrackObj('d_purchaseId', b.orderId.substring(6));

	// replace storedValueCard with GC
	if (typeof b.payTypeList != p.ud && b.payTypeList != "")
		p.addToTrackObj('payTypeList', b.payTypeList.replace(
				/storedValueCard/g, "GC"));

	// tealeaf integration
	var f = p.getCookieValue('TLTSID');
	p.addToTrackObj('tltsid', (f != "") ? f : "no_id");

	return true;
}
};

/**
 * BestBuy Custom Products plugin - syntax-
 * ;id;qty;price;event1|event2;evar1=1|evar2=2(,;id2;qty;price)
 * 
 * correlates the product id, quantity, and price captures event12 captures
 * ratings for eVar35 adds the newly created string to the cookie for checkout
 * pages
 */
trackEventCustom.plugins[6] = {
	_I : function() {
	},
	_E : function(a, b, c, d, e, f, g, h, i, j, k, p) {
		p = trackEvent; // trackEvent Object
		if (typeof b.catId != p.ud && typeof b.templateName != p.ud
				&& b.templateName.indexOf("AB") < 0
				&& b.templateName.indexOf("SRC") < 0
				&& (typeof b.skuList != p.ud || typeof b.skuId != p.ud)) {
			c = (typeof b.skuList != p.ud) ? b.skuList.split(",") : b.skuId
					.split(",");
			d = (typeof b.qtyList != p.ud) ? b.qtyList.split(",") : [ "" ];
			e = (typeof b.priceList != p.ud) ? b.priceList.split(",") : [ "" ];
			if ((d.length < c.length) || (e.length < c.length)) {
				for (i = 0; i < c.length; i++) {
					d.push("");
					e.push("");
				}
			}
			f = "";
			g = "";
			h = [];
			if (b.catId == "cat13504")
				p.mapValues("conversion", "event12", "a");
			if (typeof b.rating != p.ud && b.rating != "")
				g = "eVar35=" + b.rating;
			k = (c.length > 25) ? 25 : c.length;
			for (i = 0; i < k; i++) {
				h.push(";" + c[i] + ";" + d[i] + ";" + e[i] + ";;" + g);
			}
			j = h.join(",");
			if (j != "") {
				p.mapValues("d_product", j);
				if (b.catId == "pcat17005")
					document.cookie = this.ns + "_product=" + escape(j)
							+ ";;path=/;domain=" + Lm.config.domain + ";";

				// Todo ???: Is this the right place for Fulfillment type
				if (b.catId == "pcat17014") { // Thank you page
					// Add fulfillment type
					// Fulfillment type is a list in ffTypeList

				}
			}
		}
		return true;
	}
};
/**
 * BestBuy Custom Pages Plugin Set hour of the day within the half hour Set day
 * of week Get the facet name and value through DOM inspection Create page name
 * hierarchy Create previous page link Set the product tab value by massaging
 * the 'tab' value from the cookie Set specific values if the download cookie is
 * set Reset values in the cookie generate HREF OIDs
 */
trackEventCustom.plugins[7] = {
	_I : function() {
		// add event to window where any mouse down will set the lid on the
	// cookie
	Lm.EV(document.getElementsByTagName("body")[0], "mousedown", trackEventCustom.LC);
},
_E : function(a, b, c, d, e, f, g, h, p, q, r, s) {
	p = trackEvent; // trackEvent Object
	h = p.getCookieObject();
	h = (typeof h == p.ud) ? {} : h;

	// Time of Day/Week
	p.plc++;
	c = new Date(), d = c.getMinutes(), e = c.getHours(), f = "AM", g = {
		0 : "Sunday",
		1 : "Monday",
		2 : "Tuesday",
		3 : "Wednesday",
		4 : "Thursday",
		5 : "Friday",
		6 : "Saturday"
	};
	d = (d > 30) ? 30 : "00";
	if (e == 0)
		e = 12;
	else if (e == 12)
		f = "PM";
	else if (e > 12) {
		e -= 12;
		f = "PM";
	}
	p.mapValues("hourOfDay", e + ":" + d + " " + f);
	p.mapValues("dayOfWeek", g[c.getDay()]);

	// Facet - object error, exception negative value, firstChild null, no
	// property of firstChild, G undefined,
	try {
		c = (document.getElementById("facetselected") != null) ? document
				.getElementById("facetselected") : "";
		if (c != "" && c.style.display != 'none') {
			d = (c.getElementsByTagName("ul") != null) ? c
					.getElementsByTagName("ul") : "";
			if (d != "") {
				c = (d[0].style.display == 'none' && d.length > 1 && typeof d[1] != p.ud) ? d[1]
						.getElementsByTagName("li")
						: d[0].getElementsByTagName("li");
				c = c[c.length - 1];
				d = (c.firstChild != null && c.firstChild.nodeValue != null) ? c.firstChild.nodeValue
						: "";
				if (d != "") {
					e = d.indexOf(":");
					f = d.indexOf("null");
					if (e > 0 && f < 0) {
						e = escape(d).replace(/%0A/, '').replace(/%0A/, ' ')
								.replace(/%AE/g, '').replace(/%u2122/g, '');
						d = unescape(e);
						f = d.indexOf(":");
						p.addToTrackObj('facetName', d.substring(0, f));
						p.addToTrackObj('facetValue', b.facetName + ": "
								+ d.substring(f + 1));
					}
				}
			}
		}
	} catch (e) {
		p.addToTrackObj('error', "pl[7]: " + e);
	}

	// Construct pageName and hierarchy
	p.plc++;
	c = [ "uberCatName", "parentCatName",
			(typeof b.catId != p.ud && b.catId == "pdp") ? "catId" : "catName" ];
	d = 2;
	e = [], f = []; // Todo consider refactoring: Clumsy assignment.
	// Re-using 'e' and 'f'
	for (g = 0; g < c.length; g++) {
		if (typeof b[c[g]] != p.ud && b[c[g]] != "") {
			e.push(b[c[g]]);
			// additional logic to set the correct ubercat
			q = "d_uberCat";
			if (typeof p.b[q] == p.ud) {
				r = (c[g] == "catId") ? "catName" : c[g];
				if (typeof b[r] != p.ud && b[r] != "") {
					// if this is the thank you page then add the
					// change the ubercat to uniquely identify the checkout
					// page
					if (b[r] == "Checkout" && b.catId == "pcat17014") {
						s = "Checkout.ThankYou";
					} else {
						s = b[r];
					}
					p.mapValues(q, s);
				}
			}
			if (g <= d)
				f.push(b[c[g]]);
		}
	}
	if (e.length == 0) {
		if (typeof p.df.page != p.ud) {
			p.s_code.pageName = p.df.page;
			p.addToTrackObj('page', p.df.page);
			p.addToTrackObj('section', p.df.section);
		} else
			p.addToTrackObj('page', "error: " + document.title);
	} else {
		if (typeof b.facetName != p.ud)
			e.push("Faceted");
		if (typeof b.language != p.ud && b.language == "es")
			e.push("Spanish");
		p.addToTrackObj('page', p.s_code.pageName = e.join(": "));
		p.addToTrackObj('section', f.join(","));
		p.df.page = b.page;
		p.df.section = b.section;
	}

	// derive category
	if (typeof f[0] != p.ud && f[0] == "Checkout") {
		p.addToTrackObj('d_category', b.page);
	} else if (f.length >= 1) {
		if (typeof f[2] != p.ud) {
			if (f[2] == "pdp") {
				if (typeof f[1] != p.ud) {
					f[1] = f[1].split(':')[0];
				}
			} else if (f[2].indexOf("customerreviews") > -1) {
				f[0] = "pdp";
				f[1] = undefined;
			}
		}
		p.addToTrackObj('d_category', (typeof f[1] != p.ud) ? f[0] + ": "
				+ f[1] : f[0]);
	}

	// merchandising category
	/*
	 * if(typeof b.catId != p.ud && b.catId == "pdp") { //set merchant category
	 * as previous page or 'referrer', 'internal campaign', or 'direct'
	 * b.d_merchCategory = } else if(window.location.protocol != "https:" &&
	 * b.catId != "pcat17014" && b.catId != "pcat17005" && b.catId !=
	 * "pcat17002" && b.catId != "pcat17022" && b.catId != "pcat17013") { }
	 */

	// Previous Page: Link - no lid doesn't set
	p.plc++;
	if (typeof h.lid != p.ud) {
		if (typeof h.page != p.ud && !(b.lastLink)) {
			h.lid = (h.lid == "") ? "no lid" : h.lid;
			p.addToTrackObj('lastLink', unescape(h.page) + ": "
					+ unescape(h.lid));
			p.saveCookie("lid", "", "d");
		}
		if (h.lid.indexOf('hdr') == 0 || h.lid.indexOf('ft') == 0
				|| h.lid.indexOf('ubr') == 0) {
			p.addToTrackObj('headerFooter', h.lid);
		}
	}

	// Tabs
	p.plc++;
	if (typeof h.tab != p.ud && typeof h.page != p.ud
			&& typeof h.lastPage != p.ud) {
		f = unescape(h.tab);
		f = p.rep(f, '[', '');
		f = p.rep(f, ']', '');
		f = p.rep(f, '"', '');
		p.addToTrackObj('productTab', unescape(p.rep(h.page, "pdp", h.lastPage)
				+ ": " + f));
	}

	// bazaar
	p.plc++;
	if (typeof h.download != p.ud) {
		// p._S("conversion", "event33", "a");
		p.saveCookie("download", "", "d");
	}

	// OID
	/* p.plc++; */
	/*
	 * if (a=="event.view" && window.location.protocol != "https:" && b.catId !=
	 * "pcat17014" && b.catId != "pcat17005" && b.catId != "pcat17002" &&
	 * b.catId != "pcat17022" && b.catId != "pcat17013") { //
	 * addOnloadEvent(window.setTimeout(function(){var a = 'to';},300));
	 * addOnloadEvent(function(){setTimeout(function(){p.oid(b);},300);}); }
	 */
	// soldOut, in store only, and coming soon
	c = false;
	if (document.getElementById("soldout")) {
		c = true;
		d = "soldOutOnline";
	} else if (document.getElementById("instoreonly")) {
		c = true;
		d = "inStoreOnly";
	} else if (document.getElementById("comingsoon")) {
		c = true;
		d = "comingSoon";
	}

	if (c) {
		p.mapValues("outOfStock", d);
		p.mapValues("conversion", "event13", "a");
	}

	// If lastCatId="17000" and track.recognized="authenticated" then send
	// event9
	if (typeof h.lastCatId != p.ud
			&& (h.lastCatId == "pcat17000" || h.lastCatId == "pcat17022")
			&& b.recognized == "Authenticated") {
		// logged in
		p.mapValues("conversion", "event9", "a");
	}

	// re-set values
	p.plc++;
	p.saveCookie("tab", "", "d");
	if (typeof b.templateName != p.ud)
		p.saveCookie("lastPage", b.templateName);
	p.saveCookie("page", b.page);
	return true;
}
};

// BestBuy Custom Commerce Plugin
trackEventCustom.plugins[8] = {
	_I : function() {
	},
	/***************************************************************************
	 * Function _AFF - AddFFType to each product
	 * 
	 * @param a -
	 *            product list
	 * @param b -
	 *            fulfillment type list
	 */
	_AFF : function(a, b) {
		var c = a;
		a = a.split(',');
		b = b.split(',');
		if (a.length == b.length) {
			for ( var i = 0; i < a.length; i++) {
				c.push(a[i] + ";eVar44=" + b[i]);
			}
		}
		return c;
	},
	_E : function(a, b, c, d, e, f, g, h, i, p) {
		p = trackEvent; // trackEvent Object
		h = p.getCookieObject();
		h = (typeof h == p.ud) ? {} : h;
		g = b.catId;

		// Order Event
		if (typeof g != p.ud) {
			if ((g == "pcat17014")
					|| (typeof b.orderId != p.ud && b.orderId != "")) {
				// On Thank you page with a completed order.
				// Todo FINISH: Set shipping and fulfilment type stuff here?
				// p.b.d_product = this._AFF(p.b.d_product,b.ffTypeList);
				// console.log("p.b.d_product: " + p.b.d_product);

				p.mapValues("conversion", "purchase", "a");
				// clear the cart
				p.saveCookie("inCart", "", "d");
			}

			// Cart Events and Add to Cart report
			// purposely does not track addition or subtraction of quantity of
			// existing skus.
			// only tracks addition or subtraction of sku itself
			if (g == "pcat17005") {

				// pull the skulist from the current cart and
				// the skulist from the items that were in the cart before this
				// add or remove occurred

				c = (typeof p.b.d_product != p.ud) ? p.b.d_product.split(",")
						: [];
				d = (typeof h.inCart != p.ud && h.inCart != "undefined") ? unescape(
						h.inCart).split(",")
						: [];
				e = c.length;
				f = d.length;

				if (e != f) {
					if (e > f) {
						p.mapValues("conversion", "scAdd", "a");

						// cart open is fired every time the cart page loads. It
						// is
						// searilized on the Omniture side to only report once
						// per session
						p.mapValues("conversion", "scOpen", "a");

						// determine the product that was added
						g = this.diff(c, d);
						g += ";eVar7=" + p.b["cp.lastPage"];
					} else if (e < f) {
						p.mapValues("conversion", "scRemove", "a");

						// determine the product that was removed
						g = this.diff(d, c);
					}

					p.saveCookie("inCart", p.b.d_product);
					p.mapValues("d_product", unescape(g));
				} else {
					// nothing has been added or removed so the user is viewing
					// the cart
					p.mapValues("conversion", "scView", "a");
				}
			}

			// read track_product cookie for checkout
			if (g == "pcat17022" || g == "pcat17002") {
				f = p.getCookieValue(this.ns + "_product");
				if (f != "")
					p.mapValues("d_product", unescape(f));
				document.cookie = this.ns + "_product=;;path=/;domain="
						+ Lm.config.domain + ";";
			}

		}
		return true;
	},

	// returns the list of products that are in a and not in b

	diff : function(a, b, c, d, e, f) // 'e' and 'f' are NEVER used locally or
	// passed
	// in.
	{
		for (c in b) {
			for (d in a) {
				if (a[d] == b[c]) {
					a.splice(d, 1);
				}
			}
		}
		return a.join(',');
	}
};

// BestBuy Custom Search/Campaign Plugin
trackEventCustom.plugins[9] = {
	_I : function() {
	},
	_E : function(a, b, c, d, e, f, h, p) {
		p = trackEvent; // trackEvent Object
	h = p.getCookieObject();
	h = (typeof h == p.ud) ? {} : h;

	// Search Synonyms and Redirects
	f = (typeof p.q.st != p.ud && p.q.st.indexOf("_") > -1) ? 1 : 0;
	if (typeof b.catId != p.ud && b.catId == "pcat17071" && f > 0) {
		p.addToTrackObj('d_searchSynonym', p.q.st);
	}

	if (p.q != 0) {
		if (typeof p.q.searchterm != p.ud) {
			p.addToTrackObj('searchTerm', "redirect: " + p.q.searchterm);
			p.addToTrackObj('searchResultsNum', "redirect");
		} else if (f > 0) {
			p.addToTrackObj('searchTerm', "NA");
			p.addToTrackObj('searchResultsNum', "");
		}
	}

	// modified keyword
	if (typeof b.searchTerm != p.ud) {
		if (typeof b.searchKey != p.ud) {
			p.addToTrackObj('searchKey', b.searchTerm + ": " + b.searchKey);
			p.addToTrackObj('searchTerm', "NA");
		} else {
			p.addToTrackObj('searchKey', "NA");
		}
	}

	// Failed Search Term
	if (typeof b.searchTerm != p.ud) {
		b.searchTerm = b.searchTerm.toLowerCase();
		if (b.searchResultsNum == "0") {
			p.addToTrackObj('failedSearchTerm', b.searchTerm);
			p.addToTrackObj('searchTerm', "NA");

		} else {
			p.addToTrackObj('failedSearchTerm', "NA");
		}
	}

	// ref-loc
	if (typeof p.b["qp.ref"] != p.ud && typeof p.b["qp.loc"] != p.ud) {
		// always write ref and loc to their own cookie
		p.saveCookie("refloc", p.b["qp.ref"] + "," + p.b["qp.loc"]);
		if (typeof p.v.campaign == p.ud) {
			p.v.campaign = p.b["qp.ref"] + "," + p.b["qp.loc"];
		}
	}

	// google keywords beta
	if (typeof p.v.campaign == p.ud && typeof p.b["qp.adgroupid"] != p.ud
			&& typeof p.b["qp.query"] != p.ud)
		p.v.campaign = "GKWB_" + p.b["qp.adgroupid"] + "," + p.b["qp.query"];

	// Campaign Pathing & Latency
	c = new Date();
	d = c.getTime();

	// note: This code is in place to collect and report on specific REMIX api
	// developer keys in use
	if (typeof p.v.campaign != p.ud && p.v.campaign != "") {
		if (p.v.campaign.indexOf("rmx") > -1) {
			p.v.campaign += (p.v.campaign.indexOf("-") > -1) ? ","
					+ p.getQueryParam("ky") : "-" + h.lastCatId + ","
					+ p.getQueryParam("ky");
		}
		p.saveCookie("campaign", p.v.campaign);
		p.saveCookie("campaign_date", d);
	}

	// Campaign latency & attribution
	if (typeof b.catId != p.ud && b.catId == "pcat17014") {
		if (typeof h.campaign != p.ud && h.campaign != "") {
			p.addToTrackObj('d_campaignPath', unescape(h.campaign));
			f = b.d_campaignPath;
			if (f.indexOf("[") > -1) {
				f = eval(f);
				if (typeof f == "object" && f.length > 0)
					p.addToTrackObj('d_campaignPath', f.pop());
			}
			f = h.campaign_date;
			if (f > 0)
				p.addToTrackObj('d_campaignLatency', Math
						.ceil((d - f) / 86400000));
			p.saveCookie("campaign", "", "d");
			p.saveCookie("campaign_date", "", "d");
		}
	}
	// end REMIX code

	if (typeof p.v.campaign != p.ud && p.v.campaign != "") {
		p.saveCookie("campaign_date", d);
	}

	if (typeof b.catId != p.ud && b.catId == "pcat17014") {
		if (typeof h.campaign_date != p.ud && h.campaign_date != "") {
			f = h.campaign_date;
			if (f > 0) {
				p.addToTrackObj('d_campaignLatency', Math
						.ceil((d - f) / 86400000));
			}
			p.saveCookie("campaign_date", "", "d");
		}
	}

	return true;
}
};

/**
 * BestBuy Custom Error Detection Plugin 101: no catID 102: no template name
 * 103: no campaign 104: no roderID and no payaTypeList 301: named error jserror =
 * lmError
 */
trackEventCustom.plugins[10] = {
	_I : function() {
	},
	_E : function(a, b, c, d, e, p) {
		p = trackEvent, c = [], d = [], e = p.getCookieObject(); // Now that
	// there is
	// ugly.

	if (p.ple.length > 0)
		d.push(p.ple);

	if (typeof b.catId == p.ud || b.catId == "") {
		c.push(101);
	}
	if (typeof b.templateName == p.ud || b.templateName == "")
		c.push(102);
	if (typeof b.campaign != p.ud && b.campaign == "++")
		c.push(103);
	if (typeof b.orderId != p.ud && b.orderId != ""
			&& (typeof b.payTypeList == p.ud || b.payTypeList == ""))
		c.push("104:" + ((typeof b.tltsid != p.ud) ? b.tltsid : ""));

	if (c.length > 0)
		d.push(c.join(":") + ":" + b.page.replace(",", " "));

	if (typeof b.error != p.ud && b.error != "")
		d.push("301:" + b.error);

	if (e.error !== undefined && e.error != "") {
		d.push("302:" + e.lastCatId + ":" + e.error);
		p.saveCookie("error", "", "d");
	}
	p.addToTrackObj('imperror', d.join(","));

	// JS Error tracking
	if (typeof Lm.error != p.ud) {
		p.mapValues("jserror", Lm.error);
	}

	e = b.catId;
	if (typeof e != p.ud && e != "pcmcat152200050034"
			&& e != "pcmcat152200050035" && e != "pcmcat124600050000"
			&& e != "pcmcat107400050024") {
		p.saveCookie("lastCatId", e);
	}
	return true;
}
};

/****************************************************************
 * this function will monitor all mousedown events and determine if data needs to 
 * be written to the cookie to preserve previous page.  it looks for &lid in the name
 * of the link.
 * 
 * this function must be registered using some other function.  generally it will  be 
 * registered using 
 * Lm.EV(document.getElementsByTagName("body")[0], "mousedown", trackEventCustom.LC);
 */
trackEventCustom.LC = function(a, b, c, d, e, f, g, h, i, j) {
	
	if (!a)
		a = window.event;
	if (a.target)
		b = a.target;
	else if (a.srcElement)
		b = a.srcElement;
	if (b.nodeType == 3)
		b = b.parentNode;
	if (typeof b == "undefined" || typeof b.tagName == "undefined"
			|| b.tagName.toLowerCase() == "html")
		return;
	c = b.tagName.toLowerCase();
	if (c == "body")
		return;
	if (c != "a") {
		for (d = 0; d < 4; d++) {
			b = b.parentNode;
			c = b.tagName.toLowerCase();
			if (c == "a")
				break;
			else if (c == "body")
				return
		}
	}
	if (c == "a") {
		
		d = b.href + b.name;
		e = [ "lid" ];
		f = [ "&", "&amp;", "?" ];
		g = -1;
		for (h = 0; h < e.length; h++) {
			for (i = 0; i < f.length; i++) {
				g = d.indexOf(f[i] + e[h]);
				if (g > 0) {
					j = d.indexOf("&", g + 1);
					j = (j < 0) ? d.length : j;
					c = d.substring(g + 1 + e[h].length + f[i].length, j);
					trackEvent._SC(e[h], c);
					// break?
				}
			}
		}
		d = b.href;
		e = d.indexOf("#tabbed-");
		if (e > 0)
			trackEvent._SC("tab", d.substring(e + 8, d.length), "au");
	}
};

 

/**************************************************
 * this is the callback that alerts LiveManager
 * that loading complete.
 **************************************************/
try {
	Lm.LOAD("trackEventCustom");
} catch (e) {
}

/**
 * function to override hitbox legacy
 * 
 * @param a
 * @param b
 * @return
 */
// legacy hbx var _hbTrack={f:0};
function _hbPageView(a, b) {
	// alert("_hbPageView a: "+a+" b: "+b+" c: "+c);
	trackEvent.event("event.view", {
		page : a,
		section : b
	});
}
function _hbLink(a, b) {
	// alert("_hbLink a: "+a+" b: "+b+" c: "+c);
	trackEvent.event("event.cache", {
		lid : a
	});
}
function _hbDownload(a, b, c) { // 'b' or 'c' are not used or passed in...
	// alert("_hbDownload a: "+a+" b: "+b+" c: "+c);
	trackEvent.event("event.cache", {
		download : a
	});
}
function _hbSet(a, b, c) {
	// alert("_hbSet a: "+a+" b: "+b+" c: "+c);
	c = {
		"hbx_key" : "map_key"
	};
	if (a == "lid")
		trackEvent.event("event.cache", {
			lid : a
		});
	if (typeof c[a] != "undefined") {
		_hbTrack["f"] = 1;
		_hbTrack[c[a]] = b;
	}
}
function _hbSend() {
	// alert("_hbSend: _hbtrack: "+_hbTrack.length);
	if (typeof _hbTrack != "undefined" && _hbTrack["f"] == 1) {
		trackEvent.event("event.view", _hbTrack);
		_hbTrack = {
			f : 0
		};
	}
}
