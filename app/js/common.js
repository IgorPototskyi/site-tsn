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
    var mainNav = $('.main-nav__list');
    var socLinks = $('.social__link');

    $(window).scroll(function() {
        var pos = $(document).scrollTop();

        if (pos == 0) {
            topNav.removeClass("top-nav--dark");
        }

        if (pos > 1 && pos < 400) {
            topNav.removeClass("top-nav--light");
            socLinks.removeClass("social__link--dark");
            topNav.addClass("top-nav--dark");
            mainNav.removeClass("main-nav__list--fixed");
        }

        if (pos > 400) {
            socLinks.addClass("social__link--dark");
            topNav.removeClass("top-nav--dark");
            topNav.addClass("top-nav--light");
            mainNav.addClass("main-nav__list--fixed");
        }
    });

    // ----- Navigation Search & Share-----

    var topNavSearch = $('.top-nav__search');
    var soc = $('.social');

    topNavSearch.on('click', function() {
        soc.hide(300);
        $(this).toggleClass('top-nav__search--big');
        
    })

    $('.top-nav__share-btn').on('click', function() {
        topNavSearch.removeClass('top-nav__search--big');
        soc.toggle(300);
    })

    // ----- News header -----

    var newsLinks = $('.news__nav-link');
    newsLinks.on('click', function() {
        newsLinks.removeClass('active');
        $(this).addClass('active');
    })

    // ----- Video -----
    
    var newsItemVideo = $('.news__item-video');
    $('.news__item-share').on('click', function(e) {
        e.preventDefault(); 
        newsItemVideo.css('left', topNav.position().left + 20);
        $(this).parent().toggleClass('news__item-cont--shared');
        $(this).siblings('.news__item-video').toggleClass('active');

        
        return false; 
    })


});
