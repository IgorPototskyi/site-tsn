$(function() {

    // ----- Slider ----- 

    var sliders = $(".slider__slide");
    var navItems = $('.slider__nav-item');
    var currentPos = 0;

    sliders.hide();
    sliders.eq(0).show();
    navItems.eq(currentPos).addClass('active');
    
    navItems.on('mouseenter', function() {

        var sliderPos = $(this).attr("data-link");

        if (sliderPos != currentPos) {
            
            navItems.eq(currentPos).removeClass('active');
            $(this).addClass('active');

            sliders.eq(currentPos).animate({ height : 'hide' });
            sliders.eq(sliderPos).animate({ height : 'show' });

            var video = sliders.eq(sliderPos).find(".slider__video");
            if (video.length > 0)  video.get(0).currentTime = 0;

            currentPos = sliderPos;
        }
    });

    // ----- Scroll menu -----

    var topNav = $('.top-nav');
    var socLinks = $('.social__link');

    $(window).scroll(function() {
        if ($(document).scrollTop() > 1) {
            topNav.addClass("top-nav--dark");
        } else {
            topNav.removeClass("top-nav--dark");
        }

        if ($(document).scrollTop() > 400) {
            topNav.removeClass("top-nav--dark");
            topNav.addClass("top-nav--light");
            socLinks.addClass("social__link--dark");
        } else {
            topNav.removeClass("top-nav--light");
            topNav.addClass("top-nav--dark");
            socLinks.removeClass("social__link--dark");
        }
    });

    // ----- Search -----

    $('.top-nav__search').on('click', function() {
        $(this).toggleClass('top-nav__search--big');
    })

    // ----- Share -----

    var soc = $('.social');
    $('.top-nav__share-btn').on('click', function() {
        // soc.toggleClass('social--visible');
        soc.toggle(300);
    })

    // ----- News header -----

    var newsLinks = $('.news__nav-link');
    newsLinks.on('click', function() {
        newsLinks.removeClass('active');
        $(this).addClass('active');
    })


});
