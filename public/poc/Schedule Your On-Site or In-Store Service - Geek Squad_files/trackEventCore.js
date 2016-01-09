var trackEvent;

function trackEventLoaded() {
	if (typeof trackEventCustom == 'undefined') {
		setTimeout(trackEventLoaded, 100);
		return;
	}
		

	/***
	* trackEvent
	* Version @version@
	* Copyright (c) 2010 Best Buy (BBY).  All rights reserved.
	*
	*/
	trackEvent = {
		version: "@version@", // Version for cache busting
		c: 0,    // number of time _R has been called?
		v: {},   // Right side of the 'map' which will contain Omniture values.
		b: {},   // Left side of the 'map' which will contain BestBuy values.
		p: {},   // trackEvent often is assigned to this.
		q: 0,    // ???
		df: 0,   // ???
		ple: [], // ???
		plc: 0,  // ???
		i: new Image(), // Image object
		ga: {},  // ???
		ud: "undefined", // constant for 'undefined'
		plugins: [],

		/**
		*
		* Function _S - Set? Omniture value.
		*
		* maps the incoming variable 'b' to 'v' and 'this.b' using the map and the
		* variable name 'a' 'v' contains the value mapped to the Omniture
		* parameters 'b' contains the original variables and their values
		*
		* @param a - BBY internal value (left-side of map)
		* @param b - Omniture value (right-side of map)
		* @param c - Append to existing Omniture "v" value? If an "a" is passed in.
		* @param d - Todo refactor: NEVER PASSED IN.  Only used locally.
		* @param e - Todo refactor: NEVER PASSED IN.  Only used locally.
		*/
		mapValues: function (a, b, c, d, e) {
			d = trackEventCustom.map[a].split(",");
			for (e = 0; e < d.length; e++) {
				if (typeof c != this.ud && c == "a"
					&& typeof this.v[d[e]] != this.ud) {
					this.v[d[e]] += "," + b;
				} else
					this.v[d[e]] = b;
				this.b[a] = this.v[d[e]];
			}
		},


		/***
		*
		* Function _A - ???
		*
		* if the event 'a' is recognized all of the plugins are called
		* 'custom(a,b)' then parses through all of the event args 'b' and calls _S
		* to set the values calls _R function to finish processing
		*
		* @param a
		* @param b
		* @param c
		*/
		process: function () {
			var ctr;
			if (this.events.indexOf(this._evt) > -1 &&
				this.custom(trackEvent.plugins) &&
				this.custom(trackEventCustom.plugins)) {

				for (ctr in this.trackObj) {
					if (typeof this.trackObj[ctr] != "function") {
						if (trackEventCustom.map[ctr] != null)
							this.mapValues(ctr, this.trackObj[ctr]);
					}
				}
				this.send(); // function 'send' calls s_code/Omniture
				this.clr();  // resets the 'b' and 'v' variables
				this.c++;    // Increments the times omniture has been called?
			}
		},

		/***
		*
		* Function event - ???
		*
		* main function for events sets the event type 'a' and then delegates to
		* the _A function
		*/
		event: function (evt, trackObj) {

			if (trackEventCustom.preProcess(evt, trackObj)) {
				this._evt = evt.toLowerCase();
				this.trackObj = trackObj;
				this.process();
			}
		},

		getQueryParam: function (a) {
			var q = location.search.substring(1);
			var v = q.split("&");
			var l = v.length;
			for (var i = 0; i < l; i++) {
				var p = v[i].split("=");
				if (p[0] == a) {
					return p[1];
				}
			}
		},

		/**
		* reads the value 'a' from the cookie
		*/
		getCookieValue: function (a, b, c, d) {
			b = document.cookie;
			c = b.indexOf(a + "=");
			d = "";
			if (c > -1) {
				d = b.indexOf(";", c + 1);
				d = (d > 0) ? d : b.length;
				d = (d > c) ? b.substring(c + a.length + 1, d) : "";
			}
			return d;
		},

		/**
		* reads the base cookie and returns it as an object
		*/
		getCookieObject: function (a, b, c) {  // Todo refactor: 'c' is NEVER used...
			a = this.getCookieBase();
			eval("b=new Object(" + a + ")");
			return b;
		},

		/**
		* extract the base cookie using the namespace as the key
		*/
		getCookieBase: function (a, b, c) {
			a = document.cookie;
			b = a.indexOf(trackEventCustom.ns + "=");
			if (b == -1)
				return "";
			c = a.indexOf(";", ++b);
			if (c < 0)
				c = a.length;
			return "" + a.substring(trackEventCustom.ns.length + b, c);
		},

		/**
		* save the cookie
		*/
		saveCookie: function (a, b, c, m, d, e, f, g) {
			b = escape(b); // Todo refactor: encodeURI?
			d = this.getCookieObject();
			if (c == "i") {
				if (d[a] != null)
					return 0;
			} else if (c == "a")
				b = (d[a] != null) ? (b - 0) + (d[a] - 0) : b;
			else if (c == "ap" || c == "au") {
				if (d[a] == null)
					b = new Array("" + b);
				else {
					e = eval(d[a]);
					if (c == "au") {
						f = new Object();
						for (g = 0; g < e.length; g++) {
							f[e[g]] = 1;
						}
						if (f[b] != null)
							return 0;
						f[b] = 1;
						b = [];
						for (g in f) {
							if (typeof f[g] != "function")
								b.push(g);
						}
						g = b.length;
						m = (typeof m != this.ud) ? m : g;
						if (m < g)
							b = b.slice(g - m, g);
					} else {
						e.push(b);
						b = e;
					}
				}
				b = '["' + b.join('","') + '"]';
			}
			if (c == "d")
				delete d[a];
			else {
				d[a] = b;
			}
			a = [];
			for (b in d) {
				if (typeof d[b] != "function")
					a.push("'" + b + "'" + ":'" + d[b] + "'");
			}
			document.cookie = trackEventCustom.ns + "={" + (a.join(",")) + "};path=/;domain="
				+ Lm.config.domain + ";expires=Thu, 31 Dec 2099 00:00:00 GMT";
			return 1;
		},

		/**
		* executes all of the functions in the plugin 'pl' array
		* a = event type
		* b = track object
		* c = plugin array
		*/
		custom: function (a) {
			var d = true;
			for (var i in a) {
				if (typeof a[i] != "function")
					try {
						d &= a[i]._E(this._evt, this.trackObj);
					} catch (e) {
						this.ple.push("pl["
							+ i
							+ "]:plc["
							+ this.plc
							+ "]:"
							+ ((typeof e != this.ud) ? ("" + e).replace(
									",", " ") : ""));
					}
				if (!d)
					return d;
			}
			return d;
		},

		/**
		* reset the variable arrays 'v' and 'b'
		*/
		clr: function (a, b, c) {
			a = trackEventCustom.base.split(","), b = {};
			for (c = 0; c < a.length; c++) {
				if (typeof this.b[a[c]] != this.ud)
					b[a[c]] = this.b[a[c]];
			}
			this.b = b;
			this.v = {};
			this.trackObj = {};
		},

		/**
		* utility function that splits a string 'a' by the character 'b' and joins
		* it back together with character 'c'
		*/
		rep: function (a, b, c) {
			return (a.split(b).join(c));
		},

		/**
		* sends the variables to Omniture through the s_code script
		*/
		send: function () {
			try {
				if (Lm.config.load["s_code"]) {
					this.v = trackEventCustom.postProcessOmnitureObject(this.v);
					if (this._evt == "event.link") {
						this.s_code.tl(this.v, 'o', this.v["link_name"], this.v);
					} else {
						// event.view
						this.s_code.t(this.v);
					}
				}
				trackEventCustom.send(this._evt, this.trackObj, this.v, this.b);
			} catch (e) { }
		},

		gss: function () {
			return self.location.search.toLowerCase();
		},

		events: "event.view,event.link,event.cache",

		addToTrackObj: function (name, value) {
			this.trackObj[name] = value;
		},

		getValueByBBYName: function (bbyName) {
			return this.b[bbyName];
		},

		getValueByOmnitureName: function (omnitureName) {
			return this.v[omnitureName];
		}

	};

	// Cache Plugin
	trackEvent.plugins[0] = {
		_I: function () {
		},
		_E: function (evt, trackObj) {
			var p = trackEvent;
			if (evt == "event.cache") {
				for (var ctr in trackObj) {
					if (typeof trackObj[ctr] != "function") {
						p.saveCookie(ctr, trackObj[ctr]);
					}
				}
				return false;
			}
			return true;
		}
	};

	/**
	* Base Defaults Maps the values for the base properties in 'l' also contained
	* in trackEvent.base
	* 
	*/
	trackEvent.plugins[1] = {
		l: trackEventCustom.base.split(","),
		_I: function () {
		},
		_E: function (evt, trackObj) {
			var p = trackEvent; // trackEvent Object
			var ctr;
			if (p.df == 0) {
				p.df = {};
				for (ctr = 0; ctr < this.l.length; ctr++) {
					if (typeof trackObj[this.l[ctr]] != p.ud)
						p.df[this.l[ctr]] = trackObj[this.l[ctr]];
				}
			} else {
				for (ctr = 0; ctr < this.l.length; ctr++) {
					if (typeof trackObj[this.l[ctr]] == p.ud) {
						p.addToTrackObj(this.l[ctr], p.df[this.l[ctr]]);
					}
				}
			}
			return true;
		}
	};

	/**
	* QParam, CParam and Slot map the values for the query parameters, cookie
	* parameters and
	*/
	trackEvent.plugins[2] = {
		_I: function () {
		},
		_E: function (evt, trackObj) {
			var c, d, e, f, g, h, i, p, q;

			p = trackEvent; // trackEvent Object
			q = trackEventCustom;
			if (p.q == 0) {
				d = p.gss(), e = d.substring(1, d.length).split('&'), f = {};
				for (d in e) {
					if (typeof e[d] == "string") {
						g = e[d].split("=");
						f[g[0]] = unescape(g[1]);
					}
				}
				p.q = f;
			} else
				f = p.q;
			g = p.getCookieObject();
			h = {};
			i = {};
			for (d in q.map) {
				if (typeof q.map[d] != "function") {
					if (d.indexOf(".") > -1) {
						e = d.split(".");
						e[2] = "";
						if (e[0] == "qp") {
							e[0] = d;
							e[3] = f[e[1]];
						} else if (e[0] == "cp") {
							e[0] = d;
							e[3] = unescape(g[e[1]]);
							e[3] = (typeof e[3] == p.ud || e[3] == p.ud) ? ""
								: e[3];
						} else if (q.map[e[0] + "." + trackObj[e[0]]] != null
							&& i[e[0]] == null) {
							i[e[0]] = 1;
							e[3] = q.map[e[0] + "." + trackObj[e[0]]];
							e[2] = "a";
							e[0] = "conversion";
						}
						if (typeof e[3] != p.ud)
							p.mapValues(e[0], e[3], e[2]);
					}
					if (typeof trackObj[d] != p.ud) {
						e = q.map[d].split(",");
						for (var y = 0; y < e.length; y++) {
							if (e[y].indexOf("$") > 0) {
								var z = e[y].split("$");
								if (typeof h[z[0]] == p.ud)
									h[z[0]] = new Array(8);
								h[z[0]][z[1]] = trackObj[d];
							}
						}
					}
				}
			}
			for (d in h) {
				e = [];
				for (f = 0; f < h[d].length; f++) {
					if (typeof h[d][f] != p.ud && h[d][f].length > 0)
						e.push(h[d][f]);
				}
				p.mapValues(d, e.join(p.tok));
			}

			return true;
		}

	};

	/**
	* trackEvent init function - iterates through the plugins and calls the _I init
	* function on each -
	*/
	trackEvent.INIT = function (a, b) {
		for (var i in trackEventCustom.plugins) {
			if (typeof trackEventCustom.plugins[i] != "function") {
				try {
					trackEventCustom.plugins[i]._I();
				} catch (e) {
				}
			}
		}
		// iterate through the l array on Lm and for each
		// set the name of the lm plugin onto b
		// if the load bit is set on lm config for the given plugin
		// then set the plugin script object onto the trackEvent object
		// will only get plugins that have already been loaded through liveManager
		for (a = 0; a < Lm.l.length; a++) {
			b = Lm.l[a].a;
			if (Lm.config.load[b])
				this[b] = Lm[b];
		}
		// execute any queued events that took place while the TrackEvent
		// code was being loaded
		if (Lm.q && Lm.q["trackEvent"]) {
			a = Lm.q["trackEvent"];
			trackEvent.event(a.a, a.b);
		}
	};
	try {
		Lm.LOAD("trackEvent");
	} catch (e) {
	}


}

trackEventLoaded();