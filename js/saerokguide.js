; (function () {
    'use strict';

    var Class = window.Class || {
        browserCheck: function browserCheck() {
            var $filter = "win16|win32|win64|mac|macintel";
            var $head = $('html').find('head');

            if (navigator.platform) {
                if ( $filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) {
                    $head.prepend('<meta name="viewport" content="width=1280px">');
                }
            }

            var $ua = navigator.userAgent;
            if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || ((/msie/i).test($ua))) {
                $('html').addClass('msie').data('browser', 'msie');
            }
            if((/Android/i).test($ua)) {
                $('html').addClass('Android').data('browser', 'Android');
            } else if((/iPad|iPhone|iPod/i).test($ua)) {
                $('html').addClass('iOS').data('browser', 'iOS');
            } else if((/Chrome/i).test($ua)) {
                $('html').addClass('Chrome').data('browser', 'Chrome');
            } else if ((/safari/i).test($ua)) {
                $('html').addClass('safari').data('browser', 'safari');
            }
		},
        winResize: function winResize() {
            $(window).on('resize', function () {
                var winWidth = window.innerWidth;
                if (winWidth >= 768) {
                } else {
                }
                Class.setLayout();
                Class.slideSwiper();
            }).resize();
        },
        winScroll: function windScroll() {
            $(window)
                .on('scroll', function (e) {
                    var $wrap = $('.s_advertising_wrap');
                    var $btnTop = $('.btn_top');
                    var $winScroll = $(window).scrollTop();
                    if ($winScroll >= 50) {
                        $wrap.addClass('scrolled');
                    } else {
                        $wrap.removeClass('scrolled');
                    }

                    if ($winScroll > 300) {
                        $btnTop.show();
                    } else {
                        $btnTop.hide();
                    }
                });

        },
        gnbShow: function gnbShow() {
            var $wrap = $('.s_advertising_wrap');

            $(document)
                .off('mouseenter click', 'nav.gnb>ul>li')
                .on('mouseenter click', 'nav.gnb>ul>li', function (e) {
                    if (!$wrap.hasClass('srchShow')) {
                        $wrap.addClass('gnbShow');
                    }
                    //console.log('mouseenter click');
                })
                .off('mouseleave', 'nav.gnb>ul>li')
                .on('mouseleave', 'nav.gnb>ul>li', function (e) {
                    $wrap.removeClass('gnbShow');
                    //console.log('mouseleave');
                })
                .off('blur', 'nav.gnb>ul>li')
                .on('blur', 'nav.gnb>ul>li', function (e) {
                    var $obj = $('nav.gnb>ul>li');
                    setTimeout(function () {
                        if ($(':focus', $obj).length < 1) {
                            $obj.trigger("mouseleave");
                        }
                    }, 200)
                });

        },
        srchShow: function srchShow() {
            var $wrap = $('.s_advertising_wrap');
            var $input = $('.search_input');

            $(document)
                .off('click', '.l_advertising_header .btn_search')
                .on('click', '.l_advertising_header .btn_search', function (e) {
                    if (!$wrap.hasClass('srchShow') && !$wrap.hasClass('gnbShow')) {
                        $wrap.addClass('srchShow');
                        //$input.focus();

                    } else {
                        $wrap.removeClass('srchShow');
                    }
                })
                .off('mouseleave', '.srchShow .l_advertising_header')
                .on('mouseleave', '.srchShow .l_advertising_header', function (e) {
                    $wrap.removeClass('srchShow');
                });

        },
        slideSwiper: function slideSwiper() {
            var $swiperContainer = $('.swiper-container');
            //const winWidth = $(window).width();
            var winWidth = window.innerWidth;
            //console.log(winWidth);
            $swiperContainer.each(function () {
                var $swiperContainer = $(this);
                if ($swiperContainer.closest('.main_visual').length) {
                    var swiper = new Swiper($swiperContainer, {
                        loop: true,
                        //width: winWidth,
                        navigation: {
                            nextEl: $swiperContainer.find('.swiper-button-next'),
                            prevEl: $swiperContainer.find('.swiper-button-prev'),
                        },
                        pagination: {
                            el: $swiperContainer.find('.swiper-pagination'),
                            clickable: true,
                        },
                        autoplay: {
                            delay: 4000,
                            disableOnInteraction: true
                        },
                        on: {
                            init: function () {
                                $swiperContainer.find('.swiper-slide').attr('aria-hidden', true).removeAttr('tabindex');
                                $swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
                            },
                            slideChangeTransitionEnd: function () {
                                $swiperContainer.find('.swiper-slide').attr('aria-hidden', true).removeAttr('tabindex');
                                $swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
                            }
                        }
                    });
                    $swiperContainer.mouseenter(function () {
                        swiper.autoplay.stop();
                    });
                    $swiperContainer.mouseleave(function () {
                        swiper.autoplay.start();
                    });
                } else if ($swiperContainer.closest('.main_story').length) {
                    var swiper = new Swiper($swiperContainer, {
                        slidesPerView: 3,
                        spaceBetween: 32,
                        slidesPerGroup: 3,
                        navigation: {
                            nextEl: $swiperContainer.find('.swiper-button-next'),
                            prevEl: $swiperContainer.find('.swiper-button-prev'),
                        },
                        pagination: {
                            el: $swiperContainer.find('.swiper-pagination'),
                            clickable: true,
                        },
                        on: {
                            init: function () {
                                $swiperContainer.find('.swiper-slide').attr('aria-hidden', true).removeAttr('tabindex');
                                $swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
                            },
                            slideChangeTransitionEnd: function () {
                                $swiperContainer.find('.swiper-slide').attr('aria-hidden', true).removeAttr('tabindex');
                                $swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
                            }
                        }
                    });
                } else if ($swiperContainer.closest('.guide_layout').length) {
                    var swiper = new Swiper($swiperContainer, {
                        slidesPerView: 1,
                        //effect: 'fade',
                        navigation: {
                            nextEl: $swiperContainer.find('.swiper-button-next'),
                            prevEl: $swiperContainer.find('.swiper-button-prev'),
                        },
                        pagination: {
                            el: $swiperContainer.find('.swiper-pagination'),
                            type: 'fraction',
                            clickable: true,
                        },
                        on: {
                            init: function () {
                                $swiperContainer.find('.swiper-slide').attr('aria-hidden', true).removeAttr('tabindex');
                                $swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
                                var $text = $swiperContainer.find('.swiper-slide-active .aria_text').html();
                                $swiperContainer.closest('.guide_inner').find('.guide_left').html($text);
                            },
                            slideChangeTransitionStart: function () {
                                var $text = $swiperContainer.find('.swiper-slide-active .aria_text').html();
                                $swiperContainer.closest('.guide_inner').find('.guide_left').html($text);
                            },
                            slideChangeTransitionEnd: function () {
                                $swiperContainer.find('.swiper-slide').attr('aria-hidden', true).removeAttr('tabindex');
                                $swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
                            }
                        }
                    });
                }
            });
        },
        goTop: function goTop() {
            $(document)
                .off('click', '.btn_top')
                .on('click', '.btn_top', function (e) {
                    $('html, body').stop().animate({ scrollTop: 0 }, 400);
                });
        },
        setLayout: function setLayout() {
            var $wrap = $('.s_advertising_wrap');
            var $btnTop = $('.btn_top');
            var winHeight = window.innerHeight;
            var $winScroll = $(window).scrollTop();
            if ($winScroll >= 10) {
                $wrap.addClass('scrolled');
            } else {
                $wrap.removeClass('scrolled');
            }

            if ($winScroll > 300) {
                $btnTop.show();
            } else {
                $btnTop.hide();
            }

            var pathname = window.location.pathname;
            var path1DepthName = pathname.split('/')[1];    // contents
            var path2DepthName = pathname.split('/')[2];    // guide

            $('.gnb>ul>li li a:not(.new_window)').each(function () {
                var href1Depth = $(this).attr('href').split('/')[1]; // contents
                var href2Depth = $(this).attr('href').split('/')[2]; // guide
                if (path1DepthName == href1Depth) {
                    $(this).parents('ul').siblings('a').addClass('on');
                }

                if (path2DepthName == href2Depth) {
                    $(this).addClass('on');
                }
                //console.log(path1DepthName, href1Depth);
                //console.log(path2DepthName, href2Depth);
            });

            $(document)
                .off('click', '.btn_layer_view')
                .on('click', '.btn_layer_view', function () {
                    if (!$(this).closest('.layer_expand').hasClass('active')) {
                        $(this).attr('aria-expanded', 'true');
                        $(this).closest('.layer_expand').addClass('active');
                    } else {
                        $(this).attr('aria-expanded', 'false');
                        $(this).closest('.layer_expand').removeClass('active');
                    }
                })
                .off('click', '.layer_close')
                .on('click', '.layer_close', function () {
                    $(this).closest('.layer_expand').removeClass('active');
                    $(this).closest('.layer_expand').find('.btn_layer_view').attr('aria-expanded', 'false').focus();

                })
                .off('click', '.item_tabs li button')
                .on('click', '.item_tabs li button', function (e) {
                    var thisHref = $(this).attr('aria-controls'),
                        thisClass = '.' + $('#' + thisHref).attr('class');
                    //console.log(thisHref, thisClass);
                    $(this).closest('.item_tabs').find('li button').attr('aria-selected', 'false');
                    $(this).attr('aria-selected', 'true');

                    $(this).closest('.item_tabs_wrap').find(thisClass).hide();
                    $('#' + thisHref).show();
                })
                .off('click', '.btn_act, .btn_view, .visual .btn, .inquire')    // .inquire 클래스 선택자 추가; 광고소개 > 광고 운영에 도움받기 > 광고 문의
                .on('click', '.btn_act, .btn_view, .visual .btn, .inquire', function (e) {
                    var target = $(this).attr('aria-controls');
                    $(this).addClass('on');
                    $('#' + target).attr('aria-hidden', false).attr('tabindex', 0).addClass('active');
                    winHeight <= 948 && $('#' + target).find('.modal_content').css({'height': winHeight - 218});
                })
                .off('click', '.modal_close button')
                .on('click', '.modal_close button', function (e) {
                    var $id = $(this).closest('.modal.active').attr('id');
                    var $link = $('.on[aria-controls =  ' + $id + ']');
                    $(this).closest('.modal.active').attr('aria-hidden', true).removeAttr('tabindex').removeClass('active');
                    $(this).closest('.modal.active').find('.modal_content').removeAttr('style');
                    //$link.focus().removeClass('on');
                    $link.removeClass('on');
                });

        },
        init: function () {
            Class.winResize();
            Class.winScroll();
            Class.gnbShow();
            Class.srchShow();
            Class.slideSwiper();
            Class.goTop();
            Class.browserCheck();
        }
    }
    $(function () {
        Class.init();
    });
})();