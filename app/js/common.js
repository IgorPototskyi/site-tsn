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

    // ----- Search -----

    $('.top-nav__search').on('click', function() {
        $(this).toggleClass('top-nav__search--big');
    })

    // ----- News header -----

    var newsLinks = $('.news__nav-link');
    newsLinks.on('click', function() {
        newsLinks.removeClass('active');
        $(this).addClass('active');
    })



});
