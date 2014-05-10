/* ========================================================================
 * transitioner.js
 * by Justin Wang, 2014
 * ======================================================================== */


+function ($) {
  'use strict';

  var defaults = {
    postSelector: '.post',
    coverSelector: '.post-cover',
    imageSelector: '.post-cover-image',
    faderSelector: '.post-cover-fader',
    headerSelector: '.post-header',
    detailsSelector: '.post-details',
    faderOpacityStart: 0,
    faderOpacityMid: 0.2,
    faderOpacityEnd: 0,
    imageOpacityStart: 0,
    imageOpacityMid: 1,
    imageOpacityEnd: 0,
    headerBottomStart: 10,
    headerBottomEnd: -4,
    textOpacityMax: 1,
    textOpacityMin: 0,
    accel: 1.5
  };

  $.fn.transitioner = function (options) {

    var settings = $.extend(defaults, options);

    var updateTransition = function () {

      var top = $(window).scrollTop();
      var bottom = top + $(window).height();

      $(settings.postSelector).each(function () {

        var $post = $(this),
            $postPrev = $post.prev(),
            $cover = $post.find(settings.coverSelector),
            $image = $cover.find(settings.imageSelector),
            $fader = $cover.find(settings.faderSelector),
            $header = $cover.find(settings.headerSelector),
            $details = $post.find(settings.detailsSelector);
        
        var postTop = $post.offset().top,
            coverBottom = postTop + $image.outerHeight(),
            postBottom = postTop + $post.outerHeight();

        var colorCurr = $post.css('background-color'),
            colorPrev = colorCurr;
        if ($postPrev.length) {
          colorPrev = $postPrev.css('background-color');
        }

        // Fade in and out cover image and cover fader
        $image.css('opacity', pos2CoverElementOpacity(top, bottom, postTop, coverBottom, settings.imageOpacityStart, settings.imageOpacityMid, settings.imageOpacityEnd));
        $fader.css('opacity', pos2CoverElementOpacity(top, bottom, postTop, coverBottom, settings.faderOpacityStart, settings.faderOpacityMid, settings.faderOpacityEnd));

        // Toggle cover background color
        $cover.css('background-color', pos2CoverBackground(bottom, coverBottom, colorPrev, colorCurr));
        
        // Position header text
        $header.css('bottom', pos2HeaderBottom(top, postTop, coverBottom) + '%');
        
        // Fade out text
        $header.css('opacity', pos2TextOpacity(top, bottom, postTop, postBottom));
        $details.css('opacity', pos2TextOpacity(top, bottom, postTop, postBottom));

      });

    };

    var pos2CoverElementOpacity = function(windowTop, windowBottom, elementTop, elementBottom, opacityStart, opacityMid, opacityEnd) {

      if (windowBottom < elementTop) { // image not scrolled to
        return opacityStart;
      } else if (windowBottom < elementBottom) { // image partly scrolled to
        var percentScrolledTo = (windowBottom - elementTop) / (elementBottom - elementTop);
        return Math.min((opacityMid - opacityStart) * percentScrolledTo * settings.accel + opacityStart, opacityMid);
      } else if (windowTop < elementTop) { // image in full sight
        return opacityMid;
      } else if (windowTop < elementBottom) { // image partly scrolled past
        var percentScrolledPast = (windowTop - elementTop) / (elementBottom - elementTop);
        return Math.max((opacityEnd - opacityMid) * percentScrolledPast * settings.accel + opacityMid, opacityStart);
      } else { // image scrolled past
        return opacityEnd;
      }

    };

    var pos2CoverBackground = function(windowBottom, elementBottom, colorPrev, colorCurr) {

      if (windowBottom < elementBottom) {
        return colorPrev;
      } else {
        return colorCurr;
      }

    };

    var pos2HeaderBottom = function(windowTop, coverTop, coverBottom) {

      if (windowTop < coverTop) { // cover not scrolled to, partly scrolled to, or in full sight
        return settings.headerBottomStart;
      } else if (windowTop < coverBottom) { // cover partly scrolled past
        var percentScrolledPast = (windowTop - coverTop) / (coverBottom - coverTop);
        return Math.max(((-1 * settings.headerBottomStart + settings.headerBottomEnd) * percentScrolledPast * settings.accel) + settings.headerBottomStart, settings.headerBottomEnd);
      } else {
        return settings.headerBottomEnd;
      }

    };

    var pos2TextOpacity = function(windowTop, windowBottom, postTop, postBottom) {
      
      var windowMid = (3*windowTop + windowBottom) / 4;

      if (windowMid < postTop) { // not scrolled past halfway
        return settings.textOpacityMin;
      } else if (windowMid < postBottom) {
        return settings.textOpacityMax;
      } else {
        return settings.textOpacityMin;
      }

    };

    $(window).on('scroll', updateTransition).scroll();
    $(window).on('resize', updateTransition);

  };

}(jQuery);