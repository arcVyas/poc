jQuery(document).ready(function () {

	//jQuery('<div class="blockState"></div>').appendTo("#dd_men");
	jQuery("#dd_sub #dd_categories li:last-child,#dd_sub #dd_support li:last-child, #dd_sub #dd_help li:last-child").css("border-right", "none")

	//show my geek squad menu
	jQuery("#dd_men h2, #dd_men ul li a,.gs-nav-menu-link ").click(function () {

		if (jQuery(this).parent().hasClass('option')) {
			return;
		} else {
			closeHelp();
		}
	});
	var closeHelp = function () {
		jQuery('.search_box').val('Search...');
		jQuery("#dd_men h2").toggleClass('active');
		jQuery("#dd_men ul li.option").removeClass('subActive');
		jQuery("#dd_men ul.topLvl").stop().toggleClass('active');
	};

	jQuery("#dd_men ul li.option").click(function () {
		jQuery(this).siblings().removeClass('subActive');
		jQuery(this).toggleClass('subActive');
		jQuery(this).parent().removeClass('hover');

	});
	//size up our list items dynamically
	var sizeEm = function (li) {
		var space = jQuery(".contentContainer").width() - 1,
            itemCount = jQuery(li).size();
		return jQuery(li).width((space / itemCount) - 1);
	};
	sizeEm(jQuery('#dd_categories li'));
	sizeEm(jQuery('#dd_support li'));
	sizeEm(jQuery('#dd_help li'));

	// primary and sub nav hover actions
	jQuery(".no-touch ul#menuBlocks li,.no-touch #dd_sub #dd_support li ,.no-touch #dd_sub #dd_categories li ,.no-touch #dd_sub #dd_help li,#dd_men ul.topLvl li,.no-touch #primary ul.helpLinks li").hover(function () {
		jQuery(this).toggleClass('hover');
	});

	// click classes for primary nav
	jQuery("#dd_sub #close").click(function () {
		closeDD();
	});

	jQuery("#dd_men ul.topLvl li a").click(function () {
		if (jQuery(this).parent().hasClass('option')) {
			return
		} else {
			closeDD();
			jQuery("#dd_men ul.topLvl").removeClass('active');
		}
	});

	// Menu functions
	jQuery(".gs-nav-menu-link").bind('click', function (e) {
		e.preventDefault();

		if (jQuery('#dd_men ul.topLvl').hasClass('active')) {
			closeHelp();
		}
		if (jQuery(':animated').length) {
			return false;
		}
		jQuery("ul#menuBlocks li").removeClass('open');
		jQuery(this).parent().addClass('open');

		var target = (jQuery(this).attr('rel'));
		var state = (jQuery(this).attr('state'));
		if (state == undefined || state == 'closed') {
			jQuery("ul#menuBlocks li .gs-nav-menu-link").attr('state', 'closed');
			state = (jQuery(this).attr('state', 'open'));
			jQuery("ul " + target).addClass('top');
			removeItems();
			showCat(target);
		} else {
			removeItems();
			closeDD();
		};
	});

	var showCat = function (target) {
		jQuery("#" + target).addClass('top');
		if (jQuery('#dd_sub ul').hasClass('top')) {
			jQuery("#dd_sub").stop().animate({ 'height': '135px' }, 185, function () {
				target = "ul#" + target + "" + " " + "li";
				var len = jQuery(target).size();
				jQuery(target).each(function () {
					showItems(this, len);
				});
				jQuery("#dd_sub #close").animate({
					"top": "0px",
					opacity: "1.0"
				}, 500, function () {
					if (jQuery('#dd_sub ul').hasClass('top')) {
						return;
					} else {
						closeDD();
					}
				});
			});
		} else {
			closeDD();
		}
	};

	var showItems = function (item, len) {
		var animationDelay = 400;
		var offset = animationDelay / len;

		setTimeout(function () {
			jQuery(item).animate({
				opacity: 1
			}, animationDelay);
		}, jQuery(item).index() * offset);
	};

	var removeItems = function () {
		jQuery("#dd_sub ul").removeClass('top');
		jQuery("#dd_sub ul li").css("opacity", "0.0");
	};

	var closeDD = function () {
		jQuery("#dd_sub").stop().animate({ 'height': '0px' }, 185, function () {
			jQuery("ul#menuBlocks li a, .gs-nav-menu-link").attr('state', 'closed');
			jQuery("ul#menuBlocks li").removeClass('open');
			jQuery("#dd_sub #close").stop().animate({
				top: "40px",
				opacity: "0.0"
			}, 500, function () {
				removeItems();
			});
		});

	};

	// SEARCH BOX
	jQuery('.search_box').focus(function () {
		jQuery("#dd_men ul li.option").removeClass('subActive');
		if (jQuery(this).val() == 'Search...') {
			jQuery(this).val('');
		}

		if (jQuery(this).val() == '' || jQuery(this).val().length == 0) {
			jQuery('.view_all a').css('visibility', 'hidden');
		}
	});

	jQuery('.search_box').keypress(function (event) {
		if (event.keyCode == 13 && jQuery(this).val() != '' && jQuery(this).val() != 'Search...') {
			ShowAllSearchResults(jQuery(this).parent());
			return false;
		}
	});

	var searchResultsTimeout = null;
	jQuery('.search_box').keyup(function (event) {
		jQuery(this).parent().find('.search-btn').hide();
		jQuery(this).parent().find('.search_load').show();

		if (searchResultsTimeout != null) {
			clearTimeout(searchResultsTimeout);
			searchResultsTimeout = null;
		}
		searchResultsTimeout = setTimeout(triggerRefreshSearchResults, 500);

	});

	function triggerRefreshSearchResults() {
		clearTimeout(searchResultsTimeout);
		searchResultsTimeout = null;

		RefreshSearchResults(jQuery('.search_box').parent());
	}

	jQuery('.search_btn, .view_all').click(function (e) {

		if (jQuery(this).hasClass('disable') || jQuery('.search_box').val() == '' || jQuery('.search_box').val() == 'Search...') {
			return;
		}
		ShowAllSearchResults(jQuery(this).closest('.search'));
	});

	jQuery('body').click(function () {
		if (jQuery('.search_box').val() == '') {
			jQuery('.search_box').val('Search...');
		}
		jQuery('.search_dd').slideUp('fast');
		jQuery('.search_load').hide();
		jQuery('.search-btn').show();
	});
	jQuery('.search_box').click(function (event) {
		event.stopPropagation();
	});

	function findFocussedSearchTextBox(matches, lookFor) {
		for (var i=0; i<matches.length; i++) {
			if (matches[i] == lookFor) {
				return matches[i];
			}
		}
	}

	//search box functions
	function RefreshSearchResults(searchDiv) {
		var searchTextbox = jQuery(findFocussedSearchTextBox(searchDiv.find('input.search_box'), document.activeElement));

		var searchParent = searchTextbox.parent();
		jQuery.ajax({
		    url: headerFooterBasePathContent + "/services/search/search.aspx?query=" + searchTextbox.val(),
		    dataType: "jsonp",
			jsonp: "action",
			success: function (data) {
				var searchResults = searchParent.find('.searchResults');
				var resultTemplate = searchParent.find('.resultTemplate');
				jQuery('.search_load').hide();
				jQuery('.search-btn').show();
				searchResults.empty();
				if (data && data.d) {
					resultTemplate.tmpl(data.d).appendTo(searchResults);
					//if there are search results display the view all link otherwise hide it
					if (data.d.length > 0) {
						searchParent.find('.search_dd').slideDown('fast');
						searchParent.find('.view_all a').css('visibility', 'visible');
						searchParent.find('.search_btn').removeClass('disable');
					} else {
						searchParent.find('.search_dd').slideUp('fast');
						searchParent.find('.view_all a').css('visibility', 'hidden');
						searchParent.find('.search_btn').addClass('disable');
					}
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
			}
		});
	};

	function ShowAllSearchResults(searchDiv) {
		//    var searchButton = searchDiv.find('.search_btn')[0];
		//    __doPostBack(jQuery(searchButton).attr('id').replace(/_/g, 'jQuery'), '');
		var searchTextbox = searchDiv.find('input.search_box');

		window.location.href = headerFooterBasePathLink + '/search/default.aspx?query=' + searchTextbox.val();
};

	function EndAsyncRequest() {
		jQuery('.search_load').hide();
		jQuery('.search-btn').show();
	};
	//link tracking
	function trackContactForm(reason) {
		if (trackEvent) {
			trackEvent.event('event.link', {
				contactReason: '' + reason + ''
			});
		}
	};

});