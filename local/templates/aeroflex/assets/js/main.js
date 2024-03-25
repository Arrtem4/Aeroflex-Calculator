$(document).ready(function () {
    $('._search').on('click', function () {
        $('.search__input').toggleClass('active');
        $('.menu__list').toggleClass('hide');
        $('.header__search').toggleClass('hide');
        if ($(window).width() < 1171) {
            $('.header__logo').toggleClass('hide');
            $('.header__mobile').toggleClass('hide');
        }
    });
    $('._searchClose').on('click', function () {
        $('.search__input').toggleClass('active');
        $('.menu__list').toggleClass('hide');
        $('.header__search').toggleClass('hide');
        if ($(window).width() < 1171) {
            $('.header__logo').toggleClass('hide');
            $('.header__mobile').toggleClass('hide');
        }
    });
    $('._viewMenu').on('click', function () {
        $('.header__mobileMenu').toggleClass('active');
        $('.overlay').toggleClass('active');
        $('body').toggleClass('overflow');
    });
    $('._closeMobile').on('click', function () {
        $('.header__mobileMenu').toggleClass('active');
        $('.overlay').toggleClass('active');
        $('body').toggleClass('overflow');
    });
    $('._viewSecMenu').on('click', function (e) {
        if (!$(this).hasClass('active')) {
            e.preventDefault();
            let parent = $(e.target).parent();
            let mainParent = $(parent).parent();
            if ($(mainParent).hasClass('_viewSecMenu')) {
                $(this).addClass('active');
            }
        }

        console.log(e.target)
    })
    $('._dropdownBack').on('click ', function (e) {
        let parent = $(this).parent();
        let parent2 = $(parent).parent();
        $(parent2).removeClass('active');
    })

    $('._initSlider').slick({
        slidesToShow: 1,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        arrows: false,
        dots: false,
        appendDots: '.slickNav'
    });
    $('.slickNav .slick-dots button').each(function (item, element) {
        $(element).text(0 + '' + $(element).text());
    });
    $('._initSliderProduct').slick({
        variableWidth: true,
        arrows: true,
        slidesToShow: 1,
        dots: false,
        infinite: true,
        useTransform: false,
        appendArrows: '._initSliderProductArrows',
        prevArrow: '<div class="navArrows__item slick-prev"></div>',
        nextArrow: '<div class="navArrows__item slick-next"></div>',
    });
    $('._sliderAdvantages').slick({
        slidesToShow: 1,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        arrows: true,
        dots: false,
        appendArrows: '._sliderAdvantagesArrows',
        prevArrow: '<div class="navArrows__item slick-prev"></div>',
        nextArrow: '<div class="navArrows__item slick-next"></div>',
    });
    $('._sliderAdvantages').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        $('._goToSlide').removeClass('active');
        $('._goToSlide[data-item=' + (nextSlide + 1) + ']').addClass('active');
    });
    $('._goToSlide').on('click', function () {
        let countSlide = $(this).attr('data-item');
        $('._sliderAdvantages').slick('slickGoTo', countSlide - 1, true);
    });
    $('._sliderApplications').slick({
        variableWidth: true,
        arrows: true,
        slidesToShow: 1,
        dots: false,
        infinite: true,
        useTransform: false,
        appendArrows: '._sliderApplicationsArrow',
        prevArrow: '<div class="navArrows__item slick-prev"></div>',
        nextArrow: '<div class="navArrows__item slick-next"></div>',
    });
    $('._productDetailSlider').slick({
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        infinite: false,
        appendArrows: '._productDetailSliderArrow',
        prevArrow: '<div class="navArrows__item slick-prev"></div>',
        nextArrow: '<div class="navArrows__item slick-next"></div>',
    });

    $('._aboutSlider').slick({
        slidesToShow: 1,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        arrows: true,
        dots: false,
        prevArrow: '<div class="navArrows__item slick-prev"></div>',
        nextArrow: '<div class="navArrows__item slick-next"></div>',
    });
    if ($(window).width() < 767) {
        $('._aboutItemSlider').slick({
            slidesToShow: 1,
            speed: 500,
            fade: true,
            cssEase: 'linear',
            arrows: true,
            dots: false,
            adaptiveHeight: true,
            appendArrows: '._aboutItemSliderArrows',
            prevArrow: '<div class="navArrows__item slick-prev"></div>',
            nextArrow: '<div class="navArrows__item slick-next"></div>',
        });
    }
    $('._send').on('click', function () {
        $('.mainForm__title').hide();
        $('.mainForm__title.mainForm__title_hide').show();
        if ($(window).width() > 1170) {
            $('.mainForm__form').css({'opacity': 0, 'pointer-events': 'none'});
        } else {
            $('.mainForm__form').hide();
        }
        $('.mainForm__link a').hide();
        $('.mainForm__link .mainForm__button').css('display', 'flex');

        let callback_form = $(this).parent();

        $.ajax({
            type: "POST",
            url: '/ajax/callback.php',
            data: callback_form.serialize(),
            success: function (response) {
                // console.log(response)
				track('question_send');
                callback_form.find('input[type=text], textarea').val('');
            },
            error: function (response) {
                console.log("Ошибка отправки");
            }
        });
    });

    $('._order').on('click', function () {
        $('._orderForm').fadeToggle();
    });
    $('._sendOrder').on('click', function () {
        let parent = $(this).closest('.modalForm__content');
        $.ajax({
            type: "POST",
            url: '/ajax/order.php',
            data: $('#order').serialize(),
            success: function (response) {
                // console.log(response)
				track('order_send');
                $('#order').find('input[type=text], textarea').val('');
                $('#order').hide();
                $(parent).find('.modalForm__success').addClass('active');
                setTimeout(function () {
                    $(parent).find('.modalForm__success').removeClass('active');
                    $('._orderForm').hide();
                    $('#order').show();

                }, 1000)
                // location.href = response;
            },
            error: function (response) {
                alert("Ошибка отправки");
            }
        });
    });

    $('._diler').on('click', function () {
        $('._dilerForm').fadeToggle();
    });
    $('._sendDiler').on('click', function () {
        let parent = $(this).closest('.modalForm__content');
        $.ajax({
            type: "POST",
            url: '/ajax/diler.php',
            data: $('#diler').serialize(),
            success: function (response) {
				track('dealer_send');
                $('#diler').find('input[type=text], textarea').val('');
                $('#diler').hide();
                $(parent).find('.modalForm__success').addClass('active');
                setTimeout(function () {
                    $(parent).find('.modalForm__success').removeClass('active');
                    $('._dilerForm').hide();
                    $('#diler').show();
                }, 1000)
                // location.href = response;
            },
            error: function (response) {
                alert("Ошибка отправки");
            }
        });
    });
    $('.modalForm').on('click', function (e) {
        if ($(e.target).hasClass('modalForm__content')) {
            $('.modalForm').fadeOut();
        }
    });

    $('._accept').on('click', function () {
        $('.mainForm__title').show();
        $('.mainForm__title.mainForm__title_hide').hide();
        if ($(window).width() > 1170) {
            $('.mainForm__form').css({'opacity': 1, 'pointer-events': 'auto'});
        } else {
            $('.mainForm__form').show();
        }
        $('.mainForm__link a').show();
        $('.mainForm__link .mainForm__button').hide();
    })

    $('._selectTab').on('click', function () {
        let parent = $(this).closest('.info__content');
        let attr = $(this).attr('data-item');
        $('._selectTab').removeClass('active');
        $('.info__block').removeClass('active');
        $(this).addClass('active');
        $(parent).find('.info__block[data-item=' + attr + ']').addClass('active')
    });
    $('._downloadTab').on('click', function () {
        let parent = $(this).closest('.download__content');
        let attr = $(this).attr('data-item');
        if (attr !== '0') {
            $('.download__item').hide();
            $('.download__item[data-id='+ attr +']').show();
        } else {
            $('.download__item').show();
        }
        $('._downloadTab').removeClass('active');
        $(this).addClass('active');
        // $('.download__items').removeClass('active');

        // $(parent).find('.download__items[data-item=' + attr + ']').addClass('active')


    });
    $('._infoAccord').on('click', function () {
        let parent = $(this).parent();
        let height = $(parent).find('.info__container').height() + 64;
        if ($(window).width() > 767) {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(parent).css('height', '64px')
            } else {
                $(this).addClass('active');
                $(parent).css('height', height + 'px')
            }
        } else {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(parent).css('height', '64px')
            } else {
                $(this).addClass('active');
                $(parent).css('height', 'auto')
            }
        }
    });
    $('._downloadMobileSelect').on('click', function () {
        let parent = $(this).parent();
        $(this).toggleClass('active');
        $(parent).toggleClass('active');
    });
       
    $('._featureAccord').on('click', function () {
        let parent = $(this).parent();
        let height = $(parent).find('.feature__block').height() + 60;
        if ($(window).width() > 767) {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(parent).css('height', '60px')
            } else {
                $(this).addClass('active');
                $(parent).css('height', height + 'px')
            }
        } else {
            $(this).toggleClass('active');
            $(parent).find('.feature__block').toggleClass('active');
        }

    });
    $('.faq__items').on('click', '._faqAccord', function () {
        let parent = $(this).parent();
        $(parent).find('.faq__text').fadeToggle();
        $(parent).toggleClass('active');
    })

    $('._initSliderProject').slick({
        variableWidth: true,
        arrows: true,
        slidesToShow: 1,
        dots: false,
        infinite: true,
        useTransform: false,
        appendArrows: '._initSliderProjectArrows',
        prevArrow: '<div class="navArrows__item slick-prev"></div>',
        nextArrow: '<div class="navArrows__item slick-next"></div>',
    });
    $('._initSliderSystems').slick({
        variableWidth: true,
        arrows: true,
        slidesToShow: 1,
        dots: false,
        infinite: true,
        useTransform: false,
        appendArrows: '._initSliderSystemsArrows',
        prevArrow: '<div class="navArrows__item slick-prev"></div>',
        nextArrow: '<div class="navArrows__item slick-next"></div>',
    });

    $('._chooseSelect').on('click', function () {
        let parent = $(this).parent();
        $(parent).toggleClass('active')
    });

    $('._chooseFile').on('click', function () {
        let parent = $(this).parent();
        let counter = 0
        $(parent).find('input[type="checkbox"]').each(function(item, elem) {
            if ($(elem).prop('checked')) {
                counter++
            }
        });
        $(parent).find('.download__archive .download__button').text('Скачать ' + counter + ' файла')
        $(parent).find('.download__archive .download__count').text('Выбрано ' + counter + ' файла')
    });

    $('._projectSlider').slick({
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        infinite: false,
        appendArrows: '._projectSliderArrows',
        prevArrow: '<div class="navArrows__item slick-prev"></div>',
        nextArrow: '<div class="navArrows__item slick-next"></div>',
    });

    $('._projectSlider_v2').slick({
        variableWidth: true,
        arrows: true,
        slidesToShow: 1,
        dots: false,
        infinite: true,
        useTransform: false,
        appendArrows: '._projectSliderArrows_2',
        prevArrow: '<div class="navArrows__item slick-prev"></div>',
        nextArrow: '<div class="navArrows__item slick-next"></div>',
    });

    $('._projectSlider_v2').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        $('._block_2 .project__more').removeClass('active');
        $('._block_2 .project__more[data-item=' + (nextSlide + 1) + ']').addClass('active');
    });

    $('._projectSlider_v3').slick({
        variableWidth: true,
        arrows: true,
        slidesToShow: 1,
        dots: false,
        infinite: true,
        useTransform: false,
        appendArrows: '._projectSliderArrows_3',
        prevArrow: '<div class="navArrows__item slick-prev"></div>',
        nextArrow: '<div class="navArrows__item slick-next"></div>',
    });

    $('._projectSlider_v3').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        $('._block_3 .project__more').removeClass('active');
        $('._block_3 .project__more[data-item=' + (nextSlide + 1) + ']').addClass('active');
    });

    $(document).on('click', '.load_more', function() {
        var targetContainer = $('.faq__items'),          //  Контейнер, в котором хранятся элементы
            url =  $('.load_more').attr('data-url');    //  URL, из которого будем брать элементы

        if (url !== undefined) {
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'html',
                success: function(data){
                    console.log(data)
                    //  Удаляем старую навигацию
                    $('.load_more').remove();

                    var elements = $(data).find('.faq__item'),  //  Ищем элементы
                        pagination = $(data).find('.load_more');//  Ищем навигацию

                    targetContainer.append(elements);   //  Добавляем посты в конец контейнера
                    targetContainer.append(pagination); //  добавляем навигацию следом

                }
            })
        }
    });

    if ($('#map').length > 0) {
        ymaps.ready(init);
    }

    $('.tel').mask('+7 (999) 999-99-99');

    const anchors = document.querySelectorAll('a[href*="#"]')
});

function link(link) {
    if ($(window).width() < 768) {
        location.href = link;
    }
    return false
}

function init() {
    // Создание карты.
    var myMap = new ymaps.Map("map", {
            center: [58.00943032859066, 56.16439437743621],
            zoom: 16,
            controls: []
        }),

        myPlacemark = new ymaps.Placemark([58.00943032859066, 56.16439437743621], {
            hintContent: 'Здесь старт',
            balloonContentHeader: "ЦЕНТРАЛЬНЫЙ ОФИС В ПЕРМИ",
            balloonContentBody: "<div style='display: flex'>" +
                    "<div style='width: 55%'>" +
                        "<p>Адрес:</p>" +
                        "<p>614068, Пермь, Дзержинский район, В-411 офис; 4 этаж</p>" +
                    "</div>" +
                    "<div style='width: 45%'>" +
                        "<p>Тел: +7 (342) 294-37-01</p>" +
                        "<p>Тел: +7 (342) 209-95-06</p>" +
                        "<p>E-mail: info@aeroflex-russia.ru</p>" +
                    "</div>" +
                "</div>",
        }, {
            iconLayout: 'default#image',
            iconImageHref: '/local/templates/aeroflex/assets/img/metka.png',
            iconImageSize: [60, 73],
            iconImageOffset: [-49, -49],
            iconContentOffset: [-49, -49],
        });

    myMap.geoObjects.add(myPlacemark)

}

function ajaxLink(link) {
    $('.preloader').addClass('active');
    $.ajax({
        type: 'GET',
        url: link,
        dataType: 'html',
        success: function (data) {
            let $html = $($.parseHTML(data));
            setTimeout(function() {
                $('#root').html($html);
                history.pushState(null, null, '/test');
                $('.preloader').removeClass('active');
            }, 600);
        }
    });
}

function ajaxLink_1(link) {
    $('.preloader_1').addClass('active');
    $.ajax({
        type: 'GET',
        url: link,
        dataType: 'html',
        success: function (data) {
            let $html = $($.parseHTML(data));
            setTimeout(function() {
                $('#root').html($html);
                history.pushState(null, null, '/test');
                $('.preloader_1').removeClass('active');
            }, 1000);
        }
    });
}

function ajaxLink_2(link) {
    $('.preloader_2').addClass('active');
    $.ajax({
        type: 'GET',
        url: link,
        dataType: 'html',
        success: function (data) {
            let $html = $($.parseHTML(data));
            setTimeout(function() {
                $('#root').html($html);
                history.pushState(null, null, '/test');
                $('.preloader_2').removeClass('active');
            }, 600);
        }
    });
}

function ajaxLink_3(link) {
    $('.preloader_3').addClass('active');
    $.ajax({
        type: 'GET',
        url: link,
        dataType: 'html',
        success: function (data) {
            let $html = $($.parseHTML(data));
            setTimeout(function() {
                $('#root').html($html);
                history.pushState(null, null, '/test');
                $('.preloader_3').removeClass('active');
            }, 600);
        }
    });
}