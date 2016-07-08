$(document).ready(function() {
    if (window.wereHereAlready) {
        return;
    }
    window.wereHereAlready = true;


    $('.external_link_icon').remove();


    // Add in the style sheet if needed.
    var stylesPath = '/styles/stips.css';
    if ($('link[href="' + stylesPath + '"]').length === 0) {
        var styles = document.createElement("link");
        styles.href = stylesPath;
        styles.type = "text/css";
        styles.rel = "stylesheet";
        $("head").append(styles);
    }

    //========================================================================

    // Bind a event/callback as if it were registered as the first listener
    $.fn.bindUp = function(type, fn) {
        type = type.split(/\s+/);
        this.each(function() {
            var len = type.length;
            while( len-- ) {
                $(this).bind(type[len], fn);
                var evt = $.data(this, 'events')[type[len]];
                evt.splice(0, 0, evt.pop());
            }
        });
    };

    // The site has different versions of jquery on pages, so we need a bridge for live and on...
    liveOn = function($obj, events, fn) {
        if ($obj.on) {
            $obj.on(events, fn);
        }
        else {
            $obj.live(events, fn);
        }
    };

    function clickOnElementWhenSpaceOrEnterKeyPressed(e) {
        if (e.which === 13 || e.which === 32) {
            e.preventDefault();
            e.target.click();
        }
    }


    //========================================================================

    // Wrap the contents of each div.tab with an anchor to provide keyboard support
    $(".home-page-content .article-wrap .tab").each(function(index, el) {
        var $el = $(el);
        $el.html('<a href="javascript:void(0);" style="text-decoration: none;">' + $el.html() + '</a>').click(function(e) {
            var $el = $(e.target).closest("li.active").find(".content-block");
            if ($el.length) {
                $el.attr("aria-live", "polite")
                .attr("aria-atomic", "true");
            } else {
                $(e.target).closest("li").find(".content-block")
                .attr("aria-live", "off");
            }
        });
    });

    liveOn($('.home-page-content .article-wrap .tab'), 'keydown', clickOnElementWhenSpaceOrEnterKeyPressed);

    // Wrap the close button with an anchor tag and change focus when clicked
    $(".home-page-content .close-icon")
    .html('<a href="#">' + $(".home-page-content .close-icon").html() + '</a>')
    .bindUp("click", function(e) {
        e.preventDefault();
        var $el = $(".home-page-content .collapsible-tabs ul.article-wrap > li.active .tab a");
        $el.closest("li.active").find(".content-block")
        .attr("aria-live", "off");
        $el.focus()
        .parents("li.active")
        .removeClass("active");
    });

    // Add keyboard support to the custom select dropdowns
    $(".select-dropdown").wrap('<a href="javascript:void(0);"></a>');
    $(".select-dropdown").parent().keyup(function(e) {
        if (e.which === 13 || e.which === 32) {
            $(e.target).find(".select-dropdown dt").click();
        }
    });
    $(".select-dropdown").parent().click(function(e) {
        $(e.target).find(".select-dropdown dt").click();
    });
    var previousWasDropdown = false;
    var previousDropdown = null;
    $(document).keyup(function(e) {
        var $el = $(e.target);
        if ((e.which === 13 || e.which === 32) && previousWasDropdown) {
            previousWasDropdown = false;
            previousDropdown.focus();
        } else {
            previousWasDropdown = $el.parents(".select-dropdown").length > 0;
            if (previousWasDropdown) {
                previousDropdown = $el.parents(".select-dropdown").parent();
            }
        }
    });

    //========================================================================

    /*\
    |*|
    |*|  :: cookies.js ::
    |*|
    |*|  A complete cookies reader/writer framework with full unicode support.
    |*|
    |*|  Revision #1 - September 4, 2014
    |*|
    |*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
    |*|  https://developer.mozilla.org/User:fusionchess
    |*|
    |*|  This framework is released under the GNU Public License, version 3 or later.
    |*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
    |*|
    |*|  Syntaxes:
    |*|
    |*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
    |*|  * docCookies.getItem(name)
    |*|  * docCookies.removeItem(name[, path[, domain]])
    |*|  * docCookies.hasItem(name)
    |*|  * docCookies.keys()
    |*|
    \*/

    var docCookies = {
      getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
      },
      setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
          switch (vEnd.constructor) {
            case Number:
              sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
              break;
            case String:
              sExpires = "; expires=" + vEnd;
              break;
            case Date:
              sExpires = "; expires=" + vEnd.toUTCString();
              break;
          }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
      },
      removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
      },
      hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
      },
      keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
      }
    };


    //Always add High Contrast
    $('body').addClass('high-contrast');

    if ($('#skip').length) {
        // Remove that strange implementation of a skip to content link
        $('#skip').remove();
        $('#skipcontent').html('<span style="display: none" aria-hidden="true">Content</span>');
    }
    // Setup the truly accessible skip to content link.
    $('body').prepend('<a id="firstSkipTo" href="#skipcontent" onclick="s_objectID=&quot;http://www.geeksquad.com/#skipcontent_1&quot;;return this.s_oc?this.s_oc(e):true">Skip to main content</a>');



    document.getElementsByTagName('body')[0].addEventListener("keypress", function(e) {
        if ($(e.target).hasClass('skip-auto-wire')) {
            return;
        }

        //console.log('default handler...');
        var elTagName = e.target.tagName ? e.target.tagName.toLowerCase() : '';
        var elType = e.target.type ? e.target.type.toLowerCase() : '';
        var inputTypes = ['submit', 'button', 'reset', 'file', 'search', 'radio', 'image'];

        if (elTagName === 'a' || elTagName === 'button' || (elTagName === 'input' && (inputTypes.indexOf(elType) > -1))) {
            if (e.which == 13 || e.which == 32) {
                e.preventDefault();
                e.target.click();
            }
        }
    }, true);



    $('html').attr('lang', 'en');

    $('#closeHelper').html('<span style="display: none" aria-hidden="true">Close</span>');

    $('a').each(function(i, el) {
        var $el = $(el);
        if ($el.text() === $el.attr('title')) {
            $el.removeAttr('title');
        }
    });

    $('img').each(function(i, el) {
        var $el = $(el);
        if ($el.attr('alt') === $el.attr('title')) {
            $el.removeAttr('title');
        }
    });

    $('a[href="/chat-with-an-agent/"] font').removeAttr('color');

    $('h1, h2, h3, h4, h5').each(function(i, el) {
        if ($(el).html() === "") {
            $(el).remove();
        }
    });


    // This is ugly, but there is a new/seperate css file that does bad things. So we brute force address the styles.
    if ($('form[action="/do-it-yourself/tech-tips/Troubleshooting-Your-Home-Network-Issues.aspx"]').length) {
        $('.main p').css('font-size', '15px');
        $('.main div').css('font-size', '15px');
        $('.main a').css('font-size', '15px');
        $('.product-article p').css('font-size', '15px');
        $('.desktop-only.footer-menu.cf a, .desktop-only.footer-menu-bottom.cf a').css('font-size', '15px');
        $('.footer-copyright-content, .footer-copyright-content a').css('font-size', '15px')
    }



    // Fix the alt text of images.
    function fixAltTagsForImages() {
        var images = {};
        images['/assets/0/73/128/129/27792605-e9bb-4bfb-9ad5-1e1b3e4e85db.png'] = 'External Link';
        images['/uploadedImages/wwwgeeksquadcom/uploaded_assets/icons/support_tech(1).png'] = 'Badge';
        images['/​uploadedImages/​wwwgeeksquadcom/​protection_plans/​247support/​logo_sprite.png'] = 'Geek Squad Logo';
        images['/​uploadedImages/​wwwgeeksquadcom/​uploaded_assets/​icons/​internet_security.png'] = 'Internet Security';
        images['/​uploadedImages/​wwwgeeksquadcom/​uploaded_assets/​icons/​support_tie.png'] = 'Support Tie';
        images['/​uploadedImages/​wwwgeeksquadcom/​uploaded_assets/​icons/​support_networking(1)​.png'] = 'Support Networking';
        images['/​uploadedImages/​wwwgeeksquadcom/​uploaded_assets/​icons/​help_tools.png'] = 'Help Tools';
        images['/​uploadedImages/​wwwgeeksquadcom/​uploaded_assets/​icons/​help_tech.png'] = 'Help Tech';
        images['/​uploadedImages/​wwwgeeksquadcom/​uploaded_assets/​icons/​help_intelligence.png'] = 'Help intelligence';
        images['/​uploadedImages/​wwwgeeksquadcom/​sidebar_content/​sync-apple-device-crop.jpg'] = 'sync apple device';
        images['/uploadedImages/wwwgeeksquadcom/uploaded_assets/icons/cat_appliances.png'] = 'Category of Internet Appliances';

        function getImageCleanName(src) {
            var pieces = src.split('/');
            var imageName = pieces[pieces.length - 1];
            imageName = imageName.indexOf('?') ? imageName.split('?')[0] : imageName;
            imageName = imageName.replace(/_/ig, ' ').replace(/\.png$/i, '').replace(/\.jpg$/i, '').replace(/\.gif$/i, '');
            return imageName;
        }

        var imgs = $('img:not([alt])');
        for (var i = 0; i < imgs.length; i++) {
            var $img = $(imgs[i]);
            var urlNoQueryString = $img.attr('src').split('?')[0];
            $img.attr('alt', images[urlNoQueryString] || getImageCleanName($img.attr('src')));
        }
    }

    $('img[src="/uploadedImages/wwwgeeksquadcom/uploaded_assets/icons/cat_appliances.png"]').removeAttr('alt');
    $('img[alt="Icon"]').removeAttr('alt');

    setTimeout(fixAltTagsForImages, 1000);


    $('.header-sub-nav-panels-overlay').remove();
    $('.contentContainer #mcOverlay').remove();





    // Main site pages
    if ($('#dd_men h2').length) {

        // Get rid of the intelligence nav option.
//      $('#dd_help').removeClass('three-items');
        $('#dd_help').removeClass('3-items');
        $('#dd_help').addClass('two-items');
//      $('#dd_help').addClass('2-items');
        $('#dd_help li:last').remove();
        $('#dd_help li').css('width', '470px');

        $('#dd_men').prepend('<button class="dd-men-link skip-auto-wire">My&nbsp;Geek&nbsp;Squad</button>');
        $('#dd_men h2').remove();

        liveOn($('.dd-men-link'), 'click', function(e) {
            e.preventDefault();
            //console.log('.dd-men-link click...');
            $('#dd_men ul, #dd_men button').toggleClass('active');
        });




        $('#chatInfoContainer p span, #chatInfoContainer p span a').attr('style', 'color: #FFF;').attr('title', 'Help page for disabling popup blockers');




        $('#menuBlocks span').attr('role', 'link');
        $('#menuBlocks span').mouseup(setFocusOnMenuItem);




        // Fix the help links section at the top
        liveOn($('.helpLinks a'), 'blur focusout', function(e) {
            $(e.target).css('text-decoration', 'none');
        });

        liveOn($('.helpLinks a'), 'focus focusin', function(e) {
            $(e.target).css('text-decoration', 'underline');
        });


        $('a[href="/repair-status"] .external_link_icon').attr('alt', 'Track your repair');




        // Setup the menu anchors to be keypress accessible
        liveOn($('#dd_men .topLvl li a'), 'keydown', clickOnElementWhenSpaceOrEnterKeyPressed);

        // Add hover visibility to the focused item
        liveOn($('#dd_men .topLvl li a'), 'focus, focusin', function(e) {
            $(e.target).parent().addClass('hover');
        });

        // Add the hover visibility to the focused item
        liveOn($('#dd_men .topLvl li a'), 'blur, focusout', function(e) {
            $(e.target).parent().removeClass('hover');
        });



        var $frm = $('form[action="/protection-plans/tech-support/"]');
        if ($frm.length) {
            var $label = $($frm.find('.form-block label'));
            var $input = $($frm.find('.form-block input[type="text"]'));
            $label.attr('for', $input.attr('id'));
        }


        // White on white.. breadcrumbs
        var whiteOnWhiteBreadcrumbsSelector = 'form[action="/protection-plans/home-networking-made-simple/"], form[action="/protection-plans/internet-security-software/"]';
        $(whiteOnWhiteBreadcrumbsSelector).find('.breadcrumbs').css('color', '#000');
        $(whiteOnWhiteBreadcrumbsSelector).find('.breadcrumbs *').css('color', '#000');

        // No tabbing/navigation to the button for now. We'll figure out a better plan soon.
        $('.search_btn').attr('aria-hidden', 'false');
        $('.search_btn').attr('aria-label', 'Search the site');
        $('.search_btn').append('<span style="visibility: hidden">Search</span>');

        $($('input[name="search"]')[0]).parent().prepend('<label class="search-label" for="search" style="visibility: hidden">Search: </label>');

        // Now to make the search results accessible.
        liveOn($('.searchResults a'), 'keypress', clickOnElementWhenSpaceOrEnterKeyPressed);

        liveOn($('.searchResults a'), 'blur, focusout', function(e) {
            $($(e.target).find('span')[0]).css('text-decoration', 'none');
        });

        liveOn($('.searchResults a'), 'focus, focusin', function(e) {
            $($(e.target).find('span')[0]).css('text-decoration', 'underline');
        });

        $('.search_dd').attr('role', 'search');

        //$('#search').attr('aria-label', 'Search the site');
        //$('#search').attr('title', 'Search the site');
        //$('.search_box').attr('aria-label', 'Search the site');
        //$('.search_box').attr('title', 'Search the site');

        function setFocusOnSearchElement() {
            if ($('.searchResults a').length) {
                $('.searchResults a')[0].focus();
            }
            else {
                setTimeout(setFocusOnSearchElement, 100);
            }
        }

        var timeoutId;
        liveOn($('#search'), 'keyup', function(e) {
            window.clearTimeout(timeoutId);
            timeoutId = setTimeout(setFocusOnSearchElement, 100);
        });





        // Fix logo alt
        $('.navLogo').attr('alt', 'Geek Squad Logo');





        // Fix the first level navigation for categories, support plans and self help.
        $('.gs-nav-menu-link').attr('tabindex', '0');

        liveOn($('.gs-nav-menu-link'), 'blur, focusout', function(e) {
            $($(e.target).find('span')[0]).css('text-decoration', 'none');
        });

        liveOn($('.gs-nav-menu-link'), 'focus, focusin', function(e) {
            $($(e.target).find('span')[0]).css('text-decoration', 'underline');
        });


        function setFocusOnMenuItem(e) {
            var rel = $(e.target).attr('rel');
            setTimeout(function() {
                $('#' + rel + ' a')[0].focus();
            }, 500);
        }

        liveOn($('.gs-nav-menu-link'), 'keypress', function(e) {
            clickOnElementWhenSpaceOrEnterKeyPressed(e);
            setFocusOnMenuItem(e);
        });





        // And it's children elements
        $('#dd_sub .contentContainer').attr('role', 'widget');

        // Move the close button so its in dom order
        var $closeDiv = $('#close').detach();

        liveOn($('#dd_sub li a'), 'keypress', clickOnElementWhenSpaceOrEnterKeyPressed);

        liveOn($('#dd_sub li a'), 'blur, focusout', function(e) {
            $(e.target).css('text-decoration', 'none');
        });

        liveOn($('#dd_sub li a'), 'focus, focusin', function(e) {
            $(e.target).css('text-decoration', 'underline');
        });

        $closeDiv.append($('<a href="#" id="closeHelper"><span aria-hidden="true" style="display:none">Close</span></a>'));
        $closeDiv.insertAfter($('#dd_help'));



        function closeAndSetFocusOnMenuElement(e) {
            e.preventDefault();

            // First figure out where we're at.
            var rel = $('.contentContainer .top').attr('id');

            // Then close this up.
            $('#close')[0].click();

            // And now set the focus correctly.
            setTimeout(function() {
                $('span[rel="' + rel + '"]')[0].focus();
            }, 100);
        }

        liveOn($('#dd_sub #dd_categories a:first, #dd_sub #dd_support a:first, #dd_sub #dd_help a:first'), 'keydown', function(e) {
            if (e.which === 9 && e.shiftKey) {
                e.preventDefault();
                closeAndSetFocusOnMenuElement(e);
            }
        });

        $("#closeHelper").attr('title', 'Close');

        liveOn($('#closeHelper'), 'click', closeAndSetFocusOnMenuElement);

        liveOn($('#closeHelper'), 'keydown', function(e) {
            // If for some reason they are going backwards, let them through.
            if (e.which === 9 && e.shiftKey) {
                return;
            }
            else if (e.which === 13 || e.which === 32 || e.which === 9) {
                closeAndSetFocusOnMenuElement(e);
            }
        });

        liveOn($('#closeHelper'), 'blur, focusout', function(e) {
            $('#dd_sub #close').css('background-position', 'left 0px');
        });

        liveOn($('#closeHelper'), 'focus, focusin', function(e) {
            $('#dd_sub #close').css('background-position', 'left -20px');
        });

    }



    $('.content-block.protection-block .copy-block span').attr('tabindex', '');
    //$('.content-block .protection-block .copy-block span').attr('tabindex', '');



    // center navigation content fixes
    if ($('.home-page-content').length) {

        $('.article-wrap .content-block .inner header').append('<a href="#" class="close-content-icon" onclick="s_objectID=&quot;http://www.geeksquad.com/#_4&quot;;return this.s_oc?this.s_oc(e):true"><img class="close-x" src="/images/icn_close.jpg" alt="Close Icon"></a>');

        liveOn($('.close-content-icon'), 'click', function(e) {
            e.preventDefault();
            $('.close-icon')[0].click();
        });

        liveOn($('.close-content-icon'), 'keyup', function(e) {
            if (e.which === 13 || e.which === 32) {
                e.preventDefault();
                $('.close-icon')[0].click();
            }
        });
    }

    // *** Stips 2 ***


    $(".external_link_icon").attr("alt","Opens another Page");

    $("#scheduling").find(".detail-blocks").find(".details-container").find("h2").siblings("a:first").click(function(){
        setTimeout(function(){
                $("iframe").focus();
        },200);
    });
    $(".select-block").find("a:first").addClass("dropDown");
    $('.dropDown').attr("role","combobox");
    liveOn($('.dropDown'), 'keydown', function(e){
        var activeEl= $(document.activeElement);
        if(e.which == 40){
            e.preventDefault();
            if(activeEl.find("dl:first").hasClass("select-dropdown"))
            {
                activeEl.find("ul").attr("style","display:block");
                activeEl.find("li:first").find("a").focus();
            }
            else {
                activeEl.parent().next().find("a").focus();
            }
        }
        if(e.which == 38){
            e.preventDefault();
            if (activeEl.parent().prev().length > 0){
                activeEl.parent().prev().find("a").focus();
                }
                else{
                    $(".select-dropdown").find("ul").attr("style","display:none");
                    $('.dropDown').focus();
                }

            }
        e.stopPropagation();
    });

    $(".faq h5").attr("tabindex","0");
    liveOn($('.faq h5'), 'keydown', clickOnElementWhenSpaceOrEnterKeyPressed);

    if($(".tabs").length >0 )
    {
        $(".tabs").attr("role","tablist");
        $(".tabs li").each(function(){ $(this).attr("role","tab");});
        $(".tabs li").each(function(){
             if($(this).hasClass("active")){
                 $(this).attr("aria-selected","true");
             }
        });
        $(".tabs li").each(function(el){ $(this).attr("aria-controls","tab"+el);});
        $(".tabs li").click(function(el){
             $(".tabs li").each(function(el){
                 $(this).attr("aria-selected","false");
             });
             $(this).attr("aria-selected","true");
         });
    }

    $(".career_promo").find("a:first").focus(function(){
            $(this).find(".caption").attr("style","bottom: 0px");
    });
    $(".career_promo").find("a:first").blur(function(){
            $(this).find(".caption").attr("style","bottom: -56px");
    });

    $(".promo").find("a:first").focus(function(){
            $(this).find(".caption").attr("style","bottom: 0px");
    });
    $(".promo").find("a:first").blur(function(){
            $(this).find(".caption").attr("style","bottom: -56px");
    });

    $(".quick-select-dropdown").attr("tabindex","0");
    $('.quick-select-dropdown').attr("role","combobox");
    liveOn($('.quick-select-dropdown'), 'keydown', function(e){
        var activeEl= $(document.activeElement);
        if(e.which == 40){
            //console.log("down arr pressed");
            e.preventDefault();
            if(activeEl.hasClass("quick-select-dropdown"))
            {
                activeEl.find("ul").attr("style","display:block");
                activeEl.find("li:first").find("a").focus();
            }
            else {
                activeEl.parent().next().find("a").focus();
            }
        }
        if(e.which == 38){
            e.preventDefault();
            if (activeEl.parent().prev().length > 0){
                    activeEl.parent().prev().find("a").focus();
                }
                else{
                    $(".quick-select-dropdown").find("ul").attr("style","display:none");
                    $(".quick-select-dropdown").focus();
                }

            }
            if(e.which == 13){
                if(activeEl.hasClass("quick-select-dropdown"))
                {
                    $(e.target).find("a:first").click();
                }
                else {
                        $(e.target).click();
                    $(".quick-select-dropdown").focus();
                }

            }
        e.stopPropagation();
    });

    // *** Stips 3 ***

    // chat with an agent
    $(".pop-up_blocker_call_out img").attr("aria-hidden", "true");
    $(".chat_content .header img").attr("alt", "geek squad agent helping a customer").removeAttr("title");
    $("#ctl00_MainPlaceholder_aspxSupportSpaceButton").attr("title", "opens popup. please disable your popup blocker");

    // category pages
    $(".landing_head_img img").attr("alt", "geek squad agent helping a customer").removeAttr("title");
    $(".landing_head .lg_icon img").attr("aria-hidden", "true");
    $("p[title='temporary paragraph, click here to add a new paragraph']").removeAttr("title");

    // computers
    $("#side .promo-icon img").attr("aria-hidden", "true");
    $("img[alt='sync apple device video frame']").removeAttr("alt").removeAttr("title");
    $("#li_container1").attr("role", "menu");
    $("#li_container1 > ul > li").attr("role", "link");

    //landing
    $("#menuBlocks").attr("role", "menubar");
    $(".helpLinks").attr("role", "navigation");
    $(".article-wrap").attr("role", "menubar");
    $("[name='search']").attr("role", "search");
    $(".content-block.set-up-block > div > section > ul").attr("role", "navigation");
    $(".content-block.set-up-block > div > section > ul > li > a").attr("role", "link");

    //protection-plans/
    $(".shop-categories").attr("role", "menu");
    $(".shop-categories > div").attr("role", "menuitem");

    //protection-plans/appliance
        $("img[src='/uploadedImages/wwwgeeksquadcom/protection_plans/geek_squad_protection/dryercrop.png?n=5203']").attr("alt", "drier machine");

    //protection-plans/home-networking-made-simple
    $("img[src='/uploadedImages/wwwgeeksquadcom/protection_plans/home_networking_made_simple/help_callout_alt_2.gif']").attr("alt","serial number tag");

    //protection-plans/247-support
    $("a[href='/chat-with-an-agent/']").attr("role", "link");
    $("a[href='/find-a-location/']").attr("role", "link");
    $("a[href='/protection-plans/tech-support/']").attr("role", "link");
    $("a[href='/termsconditions/']").attr("role", "link");
    $(".faq > div > article > h5").attr("role", "tab");
    $(".faq > div > article > p").attr("role", "tabpanel");

    $("img[src='/uploadedImages/wwwgeeksquadcom/protection_plans/geek_squad_protection/protection-plan-3-easy-steps.jpg']").attr("alt", "protection plan 3 easy steps");
    $("img[src='/uploadedImages/wwwgeeksquadcom/protection_plans/geek_squad_protection/protection-plan-get-help.png?n=2116']").attr("alt", "protection plan get help");
    $("img[src='/uploadedImages/wwwgeeksquadcom/sidebar_content/sync-apple-device-crop.jpg']").attr("alt", "sync apple device");

    // Tech tips pages
    if ($('.user-dd-menu.fleft').length) {
        $('<a name="skipcontent" style="visibility: hidden" aria-hidden="false">Content</a>').insertBefore($('form'));

        // Get rid of the intelligence nav option.
        $('#sub_nav_help').removeClass('three-items');
        $('#sub_nav_help').addClass('two-items');
        $('#sub_nav_help ul li:last').remove();


        liveOn($('.header-sub-nav-panels a[href="/services/smart-home/"]'), 'keydown', function(e) {
            e.preventDefault();
            $('.header-sub-nav-close')[0].focus();
        });

        liveOn($('.header-sub-nav-panels a[href="/protection-plans/home-networking-made-simple/"]'), 'keydown', function(e) {
            e.preventDefault();
            $('.header-sub-nav-close')[0].focus();
        });

        liveOn($('.header-sub-nav-panels a[href="/tech-tips/"]'), 'keydown', function(e) {
            e.preventDefault();
            $('.header-sub-nav-close')[0].focus();
        });

        liveOn($('.header-nav a[data-sub-nav]'), 'keyup', function(e) {
            if ((e.which === 13 || e.which === 32) && $(e.target).hasClass('sub-nav-opened')) {
                // Clicked on the nav to open it. Focus on the first menu item
                e.preventDefault();
                $('#' + $(e.target).attr('data-sub-nav') + ' li a')[0].focus();
            }
        });

        liveOn($('.header-sub-nav-close'), 'keyup', function(e) {
            if ($('.sub-nav-opened').length === 0) {
                if (e.which === 9 && e.shiftKey) {
                    $('.header-nav-help a[href="/repair-status"]')[0].focus();
                }
                else if (e.which === 9) {
                    $('.breadcrumbs a')[0].focus();
                }
            }
        });

        liveOn($('.header-sub-nav-close'), 'keydown', function(e) {
            // If for some reason they are going backwards, let them through.
            if (e.which === 9 && e.shiftKey) {
                return;
            }
            else if (e.which === 13 || e.which === 32 || e.which === 9) {
                var $openNav = $('.sub-nav-opened');
                $openNav[0].click();
                $openNav[0].focus();
            }
        });

        liveOn($('.header-sub-nav-close'), 'blur, focusout', function(e) {
            $('.header-sub-nav-close').css('background-position', 'left 0px');
        });

        liveOn($('.header-sub-nav-close'), 'focus, focusin', function(e) {
            // Toggle view state if menu is open
            if ($('.sub-nav-opened').length) {
                $('.header-sub-nav-close').css('background-position', 'left -20px');
            }
        });

        // Make sure that tabbing off of the
        liveOn($('a[href="/pin"]'), 'fblur, focusout', function(e) {
            setTimeout(function() {
                if ($(document.activeElement).find('.imgWrap').length === 0) {
                    $('.user-dd-menu-btn, .topLvl').removeClass('active');
                    //$('.user-dd-menu-btn')[0].focus();
                }
            }, 100);
        });

        // No tabbing/navigation to the button for now. We'll figure out a better plan soon.
        $('.search_btn').attr('aria-hidden', 'false');
        $('.search_box.search-box').attr('aria-label', 'Search the site');
        $('.search_btn').append('<span style="visibility: hidden">Search</span>');
        $(".header-sub-nav-close").attr('title', 'Close');
        $(".header-sub-nav-close").html('<span style="display: none" aria-hidden="true">Close</span>');

        // Finally update any small fonts.
        $('*').each(function(i, e) {
            var $el = $(e);
            // First check font size
            var fSize = $el.css('font-size');
            if (fSize.length > 2 && fSize.substr(fSize.length - 2, 2).toLowerCase() === 'px' && parseInt(fSize.substr(0, fSize.length - 2), 10) < 15) {
                $el.css('font-size', '15px');
            }
        });

        $('.high-contrast .topLvl li').on('mouseover', function(e) {
            var $img = $(e.target).closest('li').find('.imgWrap img');
            $img.addClass('clip');
        });

        $('.high-contrast .topLvl li').on('mouseout', function(e) {
            var $img = $(e.target).closest('li').find('.imgWrap img');
            $img.removeClass('clip');
        });
    }
});
