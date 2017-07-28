$(function() {

    animatePreloader();

    function animatePreloader() {
        TweenMax.to('.preloader__tsn', 1.0, {'backgroundColor' : "#cc0000"});
    }

    // ----- Slider ----- 

    var currentPos = 0;
    initSlider();

    function initSlider() {
        var $sliderCont = $('.slider');

        $.getJSON('json/slider.json', function(data) {
            var slides = data.slice();
            if (slides.length) {
                parseSlides(slides, $sliderCont);
                renderSlides($sliderCont);
            }
        });
    }

    function parseSlides(slides, $sliderCont) {
        var $item,
            $itemLink,
            $itemSection,
            $sliderNav = $('.slider__nav');

        slides.forEach(function(element, i) {
            $item = $('#sliderSlideId').clone()
                                       .removeAttr("id")
                                       .removeAttr("style");
            $itemLink = $item.find('.slider__link').attr({'href' : element.link});
        
            if (element.videoSrc) {
                $item.find(".slider__video").removeAttr("style");
                $item.find(".slider__video-src").attr({"src" : element.videoSrc, 
                                                       "type" : element.videoType});
            } else {
                $itemLink.css({"background-image" : "url('" + element.imageUrl + "')"});
                $item.find(".slider__video").remove();
            }
            
            $item.find(".slider__title").html(element.title);

            $itemSection = $item.find(".slider__section").html(element.section);
            if (element.section === "ТСН День") $itemSection.addClass('slider__section--imp');

            $item.find(".slider__datetime").html(element.datetime);

            $item.appendTo($sliderCont);

            $('<li>').addClass('slider__nav-item')
                     .attr({"data-link" : i})
                     .appendTo($sliderNav);
        }, this);

        $sliderCont.find("#sliderSlideId").remove();
    }

    function renderSlides($sliderCont) {
        $slides = $sliderCont.children('.slider__slide');
        var navItems = $('.slider__nav-item');

        $slides.hide();
        $slides.eq(currentPos).show();
        navItems.eq(currentPos).addClass('active');
    }

    $('body').on('mouseenter', '.slider__nav-item', function(e) {
        var sliderPos = $(this).attr("data-link");

        if (sliderPos != currentPos) {
            $('.slider__nav-item').eq(currentPos).removeClass('active');
            $(this).addClass('active');

            $slides = $('.slider__slide');
            $slides.eq(currentPos).animate({ height : 'hide' });
            $slides.eq(sliderPos).animate({ height : 'show' });

            var video = $slides.eq(sliderPos).find(".slider__video");

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

    // ----- Navigation search & share-----

    var topNavSearch = $('.top-nav__search-btn');
    var soc = $('.social');

    topNavSearch.on('click', function() {
        soc.hide(200);
        $(this).toggleClass('top-nav__search--big');
    });

    $('.top-nav__share-btn').on('click', function() {
        topNavSearch.removeClass('top-nav__search--big');
        soc.toggle(200);
    });

    // ----- News header -----

    var newsLinks = $('.news__nav-link');
    newsLinks.on('click', function() {
        newsLinks.removeClass('active');
        $(this).addClass('active');
    });

    // ----- News content

    initNews();

    function initNews() {
        var $newsCont = $(".news__container");

        $.getJSON('json/news.json', function(data) {
            var news = data.slice();
            if (news.length) {
                renderNews(news, $newsCont);
            }
        });
    }

    function renderNews(news, $newsCont) {
        var $item,
            $itemCont,
            $itemViews,
            $itemComments,
            $itemSection;

        news.forEach(function(element) {

            $item = $('#newsItemId').clone()
                                    .removeAttr('id')
                                    .removeAttr('style');
            $itemCont = $item.find('.news__item-cont');
            $itemViews = $item.find('.news__item-views');
            $itemComments = $item.find('.news__item-comments');
            $itemSection = $item.find('.news__item-section');

            $item.find('.news__item-link').attr('href', element.link);
            $item.find('.news__item-img').attr({'src': element.imageUrl, 
                                                'alt': element.alt});
            $item.find('.news__item-title').text(element.title);

             if (element.videoSrc) {
                $itemCont.addClass('news__item-cont--video');
                $('<div>').addClass('news__item-shade').appendTo($itemCont);
                $('<i>').addClass('fa fa-play-circle-o news__icon-play').appendTo($itemCont);
                $('<i>').addClass('fa fa-share-square-o news__icon-share').appendTo($itemCont);
            }

            $itemViews.html($itemViews.html() + element.views);
            $itemComments.html($itemComments.html() + element.comments);
            $itemSection.attr('href', element.sectionLink).html(element.section);

            switch (element.section) {
                case "Світ" : $itemSection.addClass('section-world'); break;
                case "Україна" : $itemSection.addClass('section-ukr'); break;
                case "Гламур" : $itemSection.addClass('section-glam'); break;
                case "Гроші" : $itemSection.addClass('section-money'); break;
            }

            $item.find('.news__item-datetime').text(element.datetime);

            $item.appendTo($newsCont);
        }, this);
        
        $('.news__video').css('left', topNav.position().left + 20);
    }

    $('body').on('click', '.news__icon-share', function(e) {
        e.preventDefault(); 
        var newsVideo = $('.news__video');
        var newsItemCont = $('.news__item-cont');

        if (!$(this).parent().hasClass('news__item-cont--shared')) {
            newsVideo.removeClass('active');
            newsItemCont.removeClass('news__item-cont--shared');
            $(this).parent().addClass('news__item-cont--shared');

            newsVideo.children('.news__item-img').remove();
            $(this).siblings('.news__item-img').clone().prependTo(newsVideo);
            newsVideo.addClass('active');
        } else {
            newsVideo.removeClass('active');
            newsItemCont.removeClass('news__item-cont--shared');
        }

        return false; 
    });

    $('body').on('click', '.news__video-close', function(e) {
        $('.news__video').removeClass('active');
        $('.news__item-cont').removeClass('news__item-cont--shared');
    });

    // ----- Masonry gallery -----

    var photos = [];
    initGallery();
    
    function initGallery() {
        var $photosCont = $(".photos__cont");

        $.getJSON('json/photos.json', function(data) {
            photos = data.slice();
            if (photos.length) {
                renderPhotos(photos, $photosCont);

                $photosCont.masonry({
                    itemSelector: '.photos__item',
                    gutter: '.photos__gutter-sizer',
                    columnWidth: '.photos__item-sizer',
                    percentPosition: true,
                });
            }
		});
    }

    function renderPhotos(photos, $photosCont) {
        var $item;

        photos.forEach(function(element, i) {
            $item = $('#photosItemId').clone()
                                      .removeAttr('id')
                                      .removeAttr("style")
                                      .css({"background-image":"url(" + element.photosUrl[0] + ")",
                                            "background-position":element.photoPosition});

            if (element.doubleWidth === "true") $item.addClass('photos__item--width2');
            if (element.doubleHeight === "true") $item.addClass('photos__item--height2');

            if (element.doubleHeight === "true" || element.doubleWidth === "true") {
                var descr = element.description;

                if (descr.length > 50) descr = descr.slice(0, 51) + "...";
                $item.find('.photos__title').html(descr);

            } else $item.find('.photos__descr').remove();

            $item.attr("data-pos", i).appendTo($photosCont);
        }, this);
    }
   
    $('body').on('click', '.photos__open', function() {
        var position = $(this).parent().attr('data-pos');
        var photo = photos[position];
        var top = $('body').scrollTop();

        var $gallery = $('<div>').addClass('gallery')
                                 .css('padding-top', top)
                                 .appendTo('.photos');

        $('<h2>').addClass('gallery__title')
                 .html(photo.description)
                 .appendTo($gallery);

        var $galleryCont = $('<div>').addClass('fotorama gallery__cont')
                                     .attr({"data-width" : "616",
                                            "data-height" : "412",
                                            "data-nav" : "thumbs",
                                            "data-thumbwidth" : "90",
                                            "data-thumbheight" : "60",
                                            "data-thumbborderwidth" : "1",
                                            "data-thumbbordercolor" : "#fff",
                                            "data-transition" : "crossfade",
                                            "data-auto" : "false"})
                                     .appendTo($gallery);

        photo.photosUrl.forEach(function(element) {
            var $galleryLink = $('<a>').addClass('gallery__link')
                                       .attr('href', element)
                                       .appendTo($galleryCont)

            $('<img>').addClass('gallery__img')
                      .attr("src", element)
                      .appendTo($galleryLink);
        }, this);

        $('<i>').addClass('fa fa-times gallery__close')
                .css('top', top + 20)
                .appendTo($gallery);
        
        var $fotoramaDiv = $('.fotorama').fotorama();
    });

    $('body').on('click', '.gallery__close', function() {
        $('.gallery').remove();
    });

    // ----- Aside content -----

    initAside();

    function initAside() {
        var $asideCont = $(".aside__news");

        $.getJSON('json/aside.json', function(data) {
            var news = data.slice();
            if (news.length) {
                renderAside(news, $asideCont);
            }
        });
    }

    function renderAside(news, $asideCont) {
        var $item,
            $itemLink,
            $asideBanner;

        news.forEach(function(element, i) {
            
            if (element.banner === "true") {
                $asideBanner = $('#asideBannerId').clone()
                                                  .removeAttr('id')
                                                  .removeAttr('style');
                $asideBanner.find('.aside__banner-link').attr({"href" : element.link});
                $asideBanner.find('.aside__banner-img').attr({"src" : element.imageUrl, 
                                                              "alt" : element.alt });
                $asideBanner.appendTo($asideCont);
            } else {
                $item = $('#asideItemId').clone()
                                         .removeAttr('id')
                                         .removeAttr('style');
                $itemLink = $item.find('.aside__link').attr('href', element.link);

                if (element.isImportant === "true") $itemLink.addClass('aside__link--imp');

                if (element.imageUrl) {
                    $item.find('.aside__img').attr({"src" : element.imageUrl, 
                                                    "alt" : element.alt});

                    if (element.videoTime) $item.find('.aside__video-time').html(element.videoTime);
                    else $item.find(".aside__video").remove();

                } else $item.find(".aside__img-cont").remove();
                
                $item.find('.aside__item-title').html(element.title);
                $item.find('.aside__datetime').html(element.datetime);
                        
                $item.appendTo($asideCont);
            }
        }, this);
    }  

    // ----- Main navigation -----

    function setMenuItems() {
        var $mainNavList = $('.main-nav__list');
        var $aside = $('.aside');
        var $sublist = $('.main-nav__sublist');
        var $mainNavListItems;
        var $currentItem;
        

        while ($mainNavList.outerWidth() + 50 > $aside.position().left) {
            $mainNavListItems = $mainNavList.children();
            $currentItem = $mainNavListItems.eq($mainNavListItems.length - 2);

            $currentItem.removeClass()
                        .addClass('main-nav__subitem')
                        .prependTo($sublist);

            $currentItem.find('.main-nav__link')
                        .removeClass()
                        .addClass('main-nav__sublink');
        }
    }
    setMenuItems();

    $(window).on('resize', setMenuItems);

});

// ----- Preloader -----

$(window).on('load', function() {
    TweenMax.to($('.preloader__title'), 1.0, {opacity: 1});
    TweenMax.to($('.preloader'), 1.0, {opacity: 0, delay: 1.0});
    TweenMax.to($('.preloader'), 0.1, {display:'none', delay:2.0});
})



