/* ========================================================================
 * transitioner.js
 * by Justin Wang, 2014
 * ======================================================================== */


+function ($) {
  'use strict';

  var defaults = {
    image: '.post-cover-image',
    fader: '.post-cover-fader',
    fadeStart: 0,
    fadeMid: 0.2,
    fadeEnd: 0,
    header: '.post-header'
  };

  $.fn.transitioner = function (options) {

    var settings = $.extend(defaults, options);

    var updateTransition = function () {

      var top = $(window).scrollTop();
      var bottom = top + $(window).height();

      $(settings.image).each(function () {
        var $image = $(this);
        var imageTop = $image.offset().top;
        var imageBottom = imageTop + $image.outerHeight();
        $image.css('opacity', pos2ImageOpacity(top, bottom, imageTop, imageBottom));

        var $cover = $image.parent();
        var $post = $cover.parent();
        var colorCurr = $post.css('background-color'); // get color of current post
        var colorPrev = colorCurr;
        var $postPrev = $post.prev(); // default color of previous post to current
        if ($postPrev.length) { // if there is a previous post
          colorPrev = $postPrev.css('background-color');
        }
        $cover.css('background-color', pos2CoverBackground(bottom, imageBottom, colorPrev, colorCurr));

      });

      $(settings.fader).each(function () {
        var $fader = $(this);
        var faderTop = $fader.offset().top;
        var faderBottom = faderTop + $fader.outerHeight();
        $fader.css('opacity', pos2FaderOpacity(top, bottom, faderTop, faderBottom));
      });

      $(settings.header).each(function () {
        var $header = $(this);
        // var headerBottom = $header.css('bottom');
        var $cover = $header.parent();
        var coverTop = $cover.offset().top;
        var coverBottom = coverTop + $cover.outerHeight();
        $header.css('bottom', pos2HeaderBottom(top, coverTop, coverBottom) + '%');
      });

    };

    var pos2HeaderBottom = function(windowTop, coverTop, coverBottom) {
      if (windowTop < coverTop) { // cover not scrolled to, partly scrolled to, or in full sight
        return 10;
      } else { // cover partly scrolled past
        var percentage = (windowTop - coverTop) / (coverBottom - coverTop);
        return Math.max((-14 * percentage*1.5) + 10, -4);
      // } else { // cover scrolled past
        // return -10;
      }
    };

    var pos2CoverBackground = function(windowBottom, elementBottom, colorPrev, colorCurr) {
      if (windowBottom < elementBottom) {
        return colorPrev;
      } else {
        return colorCurr;
      }
    };

    var pos2ImageOpacity = function(windowTop, windowBottom, elementTop, elementBottom) {

      var percentage;

      // if (windowBottom < elementTop) { // image not scrolled to
      //   return 0;
      // } else if (windowBottom < elementBottom) { // image partly scrolled to
      //   percentage = (windowBottom - elementTop) / (elementBottom - elementTop);
      //   return percentage;
      // } else { // image scrolled past
      //   return 1;
      // }

      // if (windowTop < elementTop) { // image in full sight
      //   return 1;
      // } else if (windowTop < elementBottom) { // image partly scrolled past
      //   percentage = (windowTop - elementTop) / (elementBottom - elementTop);
      //   return Math.max((1 - percentage*1.5), 0);
      // } else { // image scrolled past
      //   return 0;
      // }

      if (windowBottom < elementTop) { // image not scrolled to
        return 0;
      } else if (windowBottom < elementBottom) { // image partly scrolled to
        percentage = (windowBottom - elementTop) / (elementBottom - elementTop);
        return percentage;
        // return Math.min(percentage*1.5, 1);
      } else if (windowTop < elementTop) { // image in full sight
        return 1;
      } else if (windowTop < elementBottom) { // image partly scrolled past
        percentage = (windowTop - elementTop) / (elementBottom - elementTop);
        return Math.max((1 - percentage*1.5), 0);
      } else { // image scrolled past
        return 0;
      }

    };

    var pos2FaderOpacity = function(windowTop, windowBottom, elementTop, elementBottom) {

      var percentage;
      // var elementMid = (4*elementBottom + elementTop) / 5;
      // var elementMid = elementBottom;

      if (windowBottom < elementTop) { // image not scrolled to
        return settings.fadeStart;
      } else if (windowBottom < elementBottom) { // image partly scrolled to
        percentage = (windowBottom - elementTop) / (elementBottom - elementTop);
        return percentage * (settings.fadeMid - settings.fadeStart) + settings.fadeStart;
      } else if (windowTop < elementTop) { // image in full sight
        return settings.fadeMid;
      } else if (windowTop < elementBottom) { // image partly scrolled past
        percentage = (windowTop - elementTop) / (elementBottom - elementTop);
        return percentage * (settings.fadeEnd - settings.fadeMid) + settings.fadeMid;
      } else { // image scrolled past
        return settings.fadeEnd;
      }

    };

    $(window).on('scroll', updateTransition).scroll();
    $(window).on('resize', updateTransition);

  };

}(jQuery);