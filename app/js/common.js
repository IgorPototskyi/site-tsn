$(function() {

    animatePreloader();

    function animatePreloader() {
        TweenMax.to('.preloader__tsn', 1.0, {'backgroundColor' : "#cc0000"});
    }

    // ----- Slider ----- 

    var currentPos = 0;
    initSlider();

    function initSlider() {
        var $sliderCont = $('<div>').addClass('slider').appendTo('.header');

        $.getJSON('../json/slider.json', function(data) {
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
            $sliderNav = $('<ul>').addClass('slider__nav');

        slides.forEach(function(element, i) {
            $item = $('<div>').addClass('slider__slide');

            $itemLink = $('<a>').addClass('slider__link')
                                .attr({'href' : element.link})
                                .appendTo($item);

            if (element.videoSrc) {
                var $itemVideo = $('<video>').addClass('slider__video')
                                             .attr({"autoplay" : true, "loop" : true, "muted" : true})
                                             .appendTo($itemLink);

                $('<source>').attr({"src" : element.videoSrc, "type" : element.videoType})
                             .appendTo($itemVideo);
            } else $itemLink.css({"background-image" : "url('" + element.imageUrl + "')"});
            
            $('<h3>').addClass('slider__title')
                     .html(element.title)
                     .appendTo($itemLink);

            var $itemDate = $('<div>').addClass('slider__date').appendTo($itemLink);
            var $itemSection = $('<span>').addClass('slider__section')
                                          .html(element.section)
                                          .appendTo($itemDate);

            if (element.section === "ТСН День") $itemSection.addClass('slider__section--imp');

            $('<span>').addClass('slider__datetime')
                       .html(element.datetime)
                       .appendTo($itemDate);

            $item.appendTo($sliderCont);

            $('<li>').addClass('slider__nav-item')
                     .attr({"data-link" : i})
                     .appendTo($sliderNav);
        }, this);

        $sliderNav.appendTo($sliderCont);
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

    var topNavSearch = $('.top-nav__search');
    var soc = $('.social');

    topNavSearch.on('click', function() {
        soc.hide(300);
        $(this).toggleClass('top-nav__search--big');
        
    });

    $('.top-nav__share-btn').on('click', function() {
        topNavSearch.removeClass('top-nav__search--big');
        soc.toggle(300);
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
        var $newsCont = $('<div>', {class : "news__container"}).appendTo(".news");

        $.getJSON('../json/news.json', function(data) {
            var news = data.slice();
            if (news.length) {
                renderNews(news, $newsCont);
            }
        });
    }

    function renderNews(news, $newsCont) {
        var $item,
            $itemCont,
            $itemLink,
            $itemDescr,
            $itemSection;

        news.forEach(function(element) {
            $item = $('<div>').addClass('news__item');
            $itemLink = $('<a>').addClass('news__item-link').attr('href', element.link);
            $itemCont = $('<div>').addClass('news__item-cont');
            $itemSection = $('<a>').addClass('news__item-section')
                                   .attr('href', element.sectionLink)
                                   .html(element.section);

            $('<img>').addClass('news__item-img')
                      .attr({'src': element.imageUrl, 
                             'alt': element.alt})
                      .appendTo($itemCont);

            if (element.videoSrc) {
                $itemCont.addClass('news__item-cont--video');
                $('<div>').addClass('news__item-shade').appendTo($itemCont);
                $('<i>').addClass('fa fa-play-circle-o news__icon-play').appendTo($itemCont);
                $('<i>').addClass('fa fa-share-square-o news__icon-share').appendTo($itemCont);
            }

            $itemCont.appendTo($itemLink);
            $('<h4>').addClass('news__item-title').text(element.title).appendTo($itemLink);

            $itemLink.appendTo($item);

            $itemDescr = $('<div>').addClass('news__item-descr');

            $('<span>').addClass('news__item-views')
                       .html('<i class="fa fa-eye"></i>' + element.views)
                       .appendTo($itemDescr);
            
            $('<span>').addClass('news__item-comments')
                       .html('<i class="fa fa-comment-o"></i>' + element.comments)
                       .appendTo($itemDescr);

            switch (element.section) {
                case "Світ" : $itemSection.addClass('section-world'); break;
                case "Україна" : $itemSection.addClass('section-ukr'); break;
                case "Гламур" : $itemSection.addClass('section-glam'); break;
                case "Гроші" : $itemSection.addClass('section-money'); break;
            }

            $('<span>').addClass('news__item-datetime')
                       .html(element.datetime)
                       .appendTo($itemDescr);

            $itemDescr.appendTo($item);
            $item.appendTo($newsCont);

        }, this);

        var $newsVideo = $('<div>').addClass('news__video').appendTo($newsCont);
        $('<i>').addClass('fa fa-play news__video-play').appendTo($newsVideo);
        $('<i>').addClass('fa fa-times news__video-close').appendTo($newsVideo);
        
    }

    $('.news__video').css('left', topNav.position().left + 20);

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
        var $photosCont = $('<div>', {class : "photos__cont"}).appendTo(".photos");

        $.getJSON('../json/photos.json', function(data) {
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
        $('<div>').addClass('photos__item-sizer').appendTo($photosCont);
        $('<div>').addClass('photos__gutter-sizer').appendTo($photosCont);
        var $item;

        photos.forEach(function(element) {
            $item = $('<div>').addClass('photos__item')
                              .css({"background-image":"url(" + element.photosUrl[0] + ")",
                                    "background-position":element.photoPosition});

            if (element.doubleWidth === "true") $item.addClass('photos__item--width2');
            if (element.doubleHeight === "true") $item.addClass('photos__item--height2');

            if (element.doubleHeight === "true" || element.doubleWidth === "true") {
                var $descr = element.description;
                var $photosDescr = $('<div>').addClass('photos__descr');
                var $photosTitle = $('<div>').addClass('photos__title');

                if ($descr.length > 50) $descr = $descr.slice(0, 51) + "...";

                $photosTitle.html($descr).appendTo($photosDescr);
                $photosDescr.appendTo($item);
            }

            $('<i>').addClass('fa fa-share-square-o photos__open').appendTo($item);
            $item.appendTo($photosCont);
        }, this);
    }
   
    $('body').on('click', '.photos__open', function() {
        // TODO
    });

    // ----- Aside content -----

    initAside();

    function initAside() {
        var $asideCont = $('<div>', {class : "aside__content"}).appendTo(".aside");

        $.getJSON('../json/aside.json', function(data) {
            var news = data.slice();
            if (news.length) {
                renderAside(news, $asideCont);
            }
        });
    }

    function renderAside(news, $asideCont) {
        $('<h2>').addClass('aside__title')
                 .html('Останні новини')
                 .appendTo($asideCont);

        var $item,
            $itemLink;

        news.forEach(function(element, i) {
            
            if (element.banner === "true") {
                var $asideBanner = $('<div>').addClass('aside__banner');
                var $asideBannerLink = $('<a>').addClass('aside__banner-link')
                                               .attr({"href" : element.link});
                
                $('<img>').attr({"src" : element.imageUrl, "alt" : element.alt })
                          .appendTo($asideBannerLink);

                $asideBannerLink.appendTo($asideBanner);
                $asideBanner.appendTo($asideCont);
               
            } else {
                $item  = $('<div>').addClass('aside__item');
                $itemLink = $('<a>').addClass('aside__link')
                                    .attr('href', element.link);

                if (element.isImportant === "true") $itemLink.addClass('aside__link--imp');

                if (element.imageUrl) {
                    var $imgCont = $('<div>').addClass('aside__img-cont');
                    $('<img>').addClass('aside__img')
                            .attr({"src" : element.imageUrl, "alt" : element.alt})
                            .appendTo($imgCont);

                    if (element.videoTime) {
                        var $asideVideo = $('<div>').addClass('aside__video')
                                                    .html('<i class="fa fa-play-circle-o"></i>Видео')
                                                    .appendTo($imgCont);

                        $('<span>').addClass('aside__video-time')
                                .html(element.videoTime)
                                .appendTo($asideVideo);
                    }
                    $imgCont.appendTo($itemLink)
                }

                $('<span>').html(element.title).appendTo($itemLink);
                $itemLink.appendTo($item);

                $('<div>').addClass('aside__datetime')
                        .html(element.datetime)
                        .appendTo($item);

                $item.appendTo($asideCont);
            }
            
        }, this);

        var $asideLoad = $('<div>').addClass('aside__load').appendTo($asideCont);
        $('<a>').addClass('aside__load-link')
                .attr('href' , '#')
                .html('Завантажити ще')
                .appendTo($asideLoad);
        $('<i>').addClass('fa fa-download').appendTo($asideLoad);
    }
    
});

// ----- Preloader -----

$(window).on('load', function() {
    TweenMax.to($('.preloader__title'), 1.0, {opacity:1});
    TweenMax.to($('.preloader'), 1.0, {display:'none', delay:1.0});
})



