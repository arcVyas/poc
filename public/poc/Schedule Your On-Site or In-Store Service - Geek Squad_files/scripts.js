
$(function ($) {//on page ready

	$('.track_outgoing_link, .track_portal_link').each(function (index) {
		if ($(this).children('img').length > 0) {//if the parent has a button class then append the white icon
			return;
		}
		else if ($(this).parent().hasClass('bestbuy')) {//if the anchor's parent has a bestbuy class then it is the logo
			return;
		}
		else if ($(this).attr('href').indexOf('support.geeksquad') > -1) {
			return;
		}
		else if ($(this).parent().hasClass('no-external-icon')) {
			return;
		}
		else if ($(this).parent().hasClass('button')) {//check to see if the child node is a <img> tag if true do nothing
			$(this).append('<img class="external_link_icon" src="/assets/0/73/128/129/6105cda0-d4c8-4a70-9b49-2b7087d4e20f.png" />'); //images/sm_white_external_link.png
		}
		else {//default is to insert the orange icon after the link
			$(this).after('<img class="external_link_icon" src="/assets/0/73/128/129/27792605-e9bb-4bfb-9ad5-1e1b3e4e85db.png" />'); //images/sm_orange_external_link.png
		}
	});

	var mto; //menu timeout

	//menu navigation
	$('#nav li').hover(
    function () {
    	if (mto) {
    		window.clearTimeout(mto);
    	}
    	$(this).parent().find('.menu_shown').removeClass('menu_shown');
    	$(this).addClass('menu_shown');

    },
    function () {
    	mto = window.setTimeout(hideAllMenus, 600);
    });

	$('#nav li ul').mouseover(function () {
		if (mto) {
			window.clearTimeout(mto);
		}
	});

	function hideAllMenus() {
		$('#nav li.menu_shown').removeClass('menu_shown');
	}

	$.fn.makeMenuColumns = function () {
		var className = "menu_col_";
		//outer loop of all first child list elements
		this.each(function () {
			var maxRows = 6;
			var numOfWrappers = 1;
			var parentID = '#' + $(this).parent().attr('id');
			//inner loop of list items within inner UL
			$(this).children().each(function (index) {
				$(this).addClass(className + numOfWrappers);
				if ((index + 1) % maxRows === 0) {
					numOfWrappers++;
				}
			});

			for (var i = 1; i <= numOfWrappers; i++) {
				$(parentID + ' .' + className + i).wrapAll('<div class="menu_column_wrapper" />');
			}
		});
	}

	$('#nav li ul .menu_list_wrapper').makeMenuColumns();

	$('.btp_plan').hover(function () { $(this).find('.btp_plan_icon').toggleClass('noshow'); }, function () { $(this).find('.btp_plan_icon').toggleClass('noshow'); });

	//setup AJAX
	jQuery.ajaxSetup({
		dataType: "jsonp",
		jsonp: "action"
	});

	//check for web fonts
	isFontFaceSupported.ready(function (supported) {
		if (!supported) { $('body').addClass('nofontface'); }
		else { $('body').addClass('fontface'); }
	});

	//remove border
	$('#nav > li:last > a, #sec_nav li:last a, .side_subscription .item:last, .chat_plans:last').css('border', 'none');
	//remove right border and margin
	$('.two_col:nth-child(2n), .two_col_wide:nth-child(2n), .two_col_noborder:nth-child(2n), .three_col:nth-child(3n), .three_col_noborder:nth-child(3n), .service_channel:last, .chat_category:nth-child(3n)').css({ 'borderRight': 'none', 'marginRight': '0px' });

	//global nav
	//$('#nav > li:last ul').css({ 'left': 'auto', 'right': '0' });
	//alert(navigator.platform);
	var adjustedWidth = (navigator.platform == 'iPad') ? '100px' : '117px';
	$('#nav > li:last').css('width', adjustedWidth);
	//get number of top level list elements on the global nav
	var navElements = $('#nav > li').length;
	//get number of top left list elements that should have their child ul positioned right
	var numOfRightElements = Math.round(navElements / 2);
	//position child ul lists to the right on all the right most top level list elements
	for (var i = numOfRightElements; i < navElements; i++) {
		$('#nav > li:eq(' + i + '):last ul').css({ 'left': 'auto', 'right': '0px' });
	}

	//make link lists into columns
	$('.columnize').makeacolumnlists();

	//home
	$('.home_category').each(function (index) {
		var category_link = $(this).find('li:last a').attr('href');
		$(this).find('a:first').attr('href', category_link);
	});
	$('.home_category').hover(function () {
		$(this).css('background-color', '#f5f5f5');
	}, function () {
		$(this).css('background-color', '#fff');
	});

	//promos
	$('.promo, .multilink_promo, #billboard').each(function (index) {
		var promo_height = $(this).find('.caption').innerHeight();
		var bottom = promo_height - 20;
		$(this).find('.caption').css('bottom', '-' + bottom + 'px');

		if ($(this).attr('id') == 'billboard' && $(this).find('h1').text().indexOf('Untangle') > -1) {
			//hide caption
			$(this).find('.caption').css('opacity', 0);
			//shrink heading text
			$(this).find('h1').css('font-size', '28px');
		}

		$(this).hover(function () {
			$(this).find('.caption').stop().animate({ 'bottom': '0px' }, { queue: false, duration: 450, easing: 'easeOutQuint' });
		}, function () {
			$(this).find('.caption').stop().animate({ 'bottom': '-' + bottom + 'px' }, { queue: false, duration: 350, easing: 'easeInQuint' });
		});
	});

	var techMemAccessTuneUp = $('a[title="Tune Up Now"]');
	if (techMemAccessTuneUp.length > 0) {
		var href = techMemAccessTuneUp.attr('href') + $('input:hidden[id*=hidMemContractId]').val();
		techMemAccessTuneUp.attr('href', href);
	}

	//tabs
	$(".tab_content").hide();
	var hash = window.location.hash.toString()

	if (window.location.hash == '#member') {
		$('.tabs li.member').addClass("active").show();
		$('div.member').show();
	}
	else if (hash != "" && hash.indexOf('_tab') > -1 && hash != '#_tab') {
		var tab = '#' + hash.substring(2);
		//find the tab
		$('.tabs li').each(function (i) {
			if ($(this).find('a').attr('href') == tab) {
				$(this).addClass('active');
			} else {
				$(this).removeClass('active');
				$(tab).show();
			}
		});
	}
	else if ($('input:hidden[id*=tabToSelect]').val() != null && $('input:hidden[id*=tabToSelect]').val() != '0') {
		var val = $('input:hidden[id*=tabToSelect]').val();
		$('.tabs li:nth-child(' + val + ')').addClass("active").show();
		$('.tab_content:nth-child(' + val + ')').show();
	}
	else {
		$('.tabs li:first').addClass("active").show();
		$('.tab_content:first').show();
	}


	$('.tabs li').click(function () {
		$('.tabs li').removeClass('active');
		$(this).addClass('active');
		$('.tab_content').hide();
		var activeTab = $(this).find('a').attr('href');
		$(activeTab).fadeIn();
		window.location.hash = '_' + activeTab.substring(1);
		return false;
	});


	$('a[href^="#tab"]').click(function () {
		if ($(this).closest('.tabs li').length > 0)
			return;

		var tabHref = $(this).attr('href');
		var activeTab = $('.tabs li a[href=' + tabHref + ']');
		activeTab.parent().click();

		return false;
	});

	$('.member_input .button a').click(function () {
		window.location = $(this).attr('href');
	});

	$('.member_input .form_field input').bind('keyup', function (e) {
		if (e.which == 13) {
			$('.member_input .button a').click();
		}
	});

	//modal window
	$('a.popup').nyroModal({ forceType: 'iframe', width: 685, height: 375 });
	$('a.video').nyroModal();

	$.nyroModalSettings({
		processHandler: function (settings) {
			var from = settings.from;
			if (from && from.href && from.href.indexOf('www.youtube.com/watch?v=') >= 0) {
				$.nyroModalSettings({
					type: 'swf',
					width: 640,
					height: 390,
					url: from.href.replace(new RegExp("watch\\?v=", "i"), 'v/')
				});
			}
		}
	});

	//link tracking
	$('.track_outgoing_link').click(function () {
		trackEvent.event('event.link', { lastLink: '' + $(this).attr('title') + '' });
	});
	$('.track_portal_link').click(function () {
		trackEvent.event('event.link', { lastLink: 'portal: ' + $(this).attr('title') + '' });
	});

	$('.tc-cat').each(function (index) {
		var originalHeight = $(this).find('.tc-cat-content').height();
		$(this).data({ 'expandedHeight': originalHeight });
		if (index > 1) {
			$(this).find('.tc-cat-content').css({ height: '0px', opacity: 0, display: 'none' });
			$(this).find('.tc-cat-header').addClass('closed');
		}

		var selectedValue = $(this).find('select').val();
		if (selectedValue == -1 || selectedValue == 0) {
			$(this).find('p.button a').addClass('disabled'); // css('background', '#ccc');
		}
		else {
			$(this).find('p.button a').removeClass('disabled');
		}
	});

	$('.tc-cat-content select').change(function (e) {
		if ($(this).val() != -1) {
			$(this).parent().find('p.button a').removeClass('disabled');
		}
		else {
			$(this).parent().find('p.button a').addClass('disabled');
		}
	});

	$('.tc-cat-header').click(function (e) {
		e.preventDefault();
		var h = $(this).parent().data('expandedHeight') + 'px';
		if (!h) {
			h = 200;
		}
		if ($(this).hasClass('closed')) {
			$(this).parent().find('.tc-cat-content').css('display', 'block').animate({ height: h, opacity: 1 }, 300);
		}
		else {
			$(this).parent().find('.tc-cat-content').animate({ height: '0px', opacity: 0 }, 300, function () { $(this).css('display', 'none'); });
		}
		$(this).toggleClass('closed');
	});

	$('.tc-two_col div').last().css({ width: '330px', padding: '0 0 0 20px' });

	$('.init-tc-download').click(function (e) {
		e.preventDefault();
		var pdf = $(this).parent().parent().find('select').val();
		if (!pdf || pdf == -1) { return; }
		var path = pdf; //.substring(pdf.indexOf('href="') + 6, pdf.indexOf('" title'));
		//window.location = path;
		var w = window.location.protocol + '//' + window.location.host + path;
		window.open(w);
	});
	/*
	function setCookie(name) {
	var dt = new Date();
	dt.setDate(dt.getDate() + 7);
	var c = 'gs_ieUpgrade=declined; expires=' + dt.toUTCString();
	document.cookie = c;
	}
	*/

	var displayTextNodes = $('.a_display_text');
	$.each(displayTextNodes, function () {
		$(this).replaceWith($('<span>' + this.innerHTML + '</span>'));
	});



	if ($('input[name$="ts_ContractID"').length > 0) {
		$('input[name$="ts_ContractID"], input[name$="ts_Zipcode"]').keypress(function (e) {
			if (e.which === 13) {
				var btnHref = $('a.button').first().attr('href');
				eval(btnHref);
			}
		});
	}
});          //end page ready function                                                         

//link tracking
function trackContactForm(reason){
    if (trackEvent) { trackEvent.event('event.link', { contactReason: '' + reason + '' }); }
};