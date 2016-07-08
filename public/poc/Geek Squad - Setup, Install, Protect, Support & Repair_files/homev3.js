var collapsibleTabs = function () {
    var tabSection = $('.collapsible-tabs'),
				tab = $('.collapsible-tabs li .tab'),
				closeIcon = $('.collapsible-tabs .close-icon');

    $(tab).bind('click', function () {
        var self = $(this);

        if (!$(self).parent().hasClass('active')) {
            $(tabSection).addClass('open').animate({
                'height': '430px'
            });
        } else {
            $(tabSection).removeClass('open').animate({
                'height': '100px'
            });
        }
        self.parent().siblings().removeClass('active');
        self.parent().toggleClass('active');
    });
    $(closeIcon).bind('click', function () {
        $(tab).removeClass('active');
        $(tabSection).removeClass('open').animate({
            'height': '100px'
        });
    });
};
collapsibleTabs();

var dropDown = function () {
    // quick select dropdown
    var quickSelect = $(".select-dropdown");

    // Onclick on a dropdown, toggle visibility
    quickSelect.find("dt").click(function () {
        quickSelect.find("dd ul").hide();
        $(this).next().children().toggle();
    });

    // Click handler for dropdown
    quickSelect.find("dd ul li a").click(function () {
        var leSpan = $(this).parents(".select-dropdown").find("dt a span");

        // Remove selected class
        $(this).parents(".select-dropdown").find('dd a').each(function () {
            $(this).removeClass('selected');
        });

        // Update selected value
        leSpan.html($(this).html());

        // If back to default, remove selected class else addclass on right element
        if ($(this).hasClass('default')) {
            leSpan.removeClass('selected')
            $('.quick-start-go-btn').removeClass('quick-start-go-btn-active');
        }
        else {
            leSpan.addClass('selected');
            $(this).addClass('selected');
            $('.quick-start-go-btn').addClass('quick-start-go-btn-active');
        }
        // Close dropdown
        $(this).parent("ul").hide();
    });

    // Close all dropdown onclick on another element
    $(document).bind('click', function (e) {
        if (!$(e.target).parents().hasClass("select-dropdown")) $(".select-dropdown dd ul").hide();
    });
};
dropDown();