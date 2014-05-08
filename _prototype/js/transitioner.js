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
    fadeMid: 0.12,
    fadeEnd: 0.84
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
        $image.css('opacity', pos2Opacity(top, bottom, imageTop, imageBottom));
        var $cover = $image.parent();
        var $post = $cover.parent();
        var colorCurr = $post.css('background-color');
        var $postPrev = $post.prev();
        var colorPrev = colorCurr;
        if ($postPrev.length) { // if there is a previous post
          colorPrev = $postPrev.css('background-color');
        }
        $cover.css('background-color', pos2Background(bottom, imageBottom, colorPrev, colorCurr));
      });

      $(settings.fader).each(function () {
        var $fader = $(this);
        var faderTop = $fader.offset().top;
        var faderBottom = faderTop + $fader.outerHeight();
        $fader.css('opacity', pos2FaderOpacity(top, bottom, faderTop, faderBottom));
      });

    };

    var pos2Opacity = function(windowTop, windowBottom, elementTop, elementBottom) {

      var percentage;
      var elementMid = (4*elementBottom + elementTop) / 5;

      if (windowBottom < elementTop) { // image not scrolled to
        return 0;
      } else if (windowBottom < elementMid) { // image partly scrolled to
        percentage = (windowBottom - elementTop) / (elementMid - elementTop);
        return percentage;
      // } else if (windowTop < elementTop) { // image in full sight
      //   return 1;
      // } else if (windowTop < elementBottom) { // image partly scrolled past
      //   percentage = (windowTop - elementTop) / (elementBottom - elementTop);
      //   return (1 - percentage);
      } else { // image scrolled past
        // return 0;
        return 1;
      }

    };

    var pos2Background = function(windowBottom, elementBottom, colorPrev, colorCurr) {
      if (windowBottom < elementBottom) {
        return colorPrev;
      } else {
        return colorCurr;
      }
    };

    var pos2FaderOpacity = function(windowTop, windowBottom, elementTop, elementBottom) {

      var percentage;
      var elementMid = (4*elementBottom + elementTop) / 5;

      if (windowBottom < elementTop) { // image not scrolled to
        return settings.fadeStart;
      } else if (windowBottom < elementMid) { // image partly scrolled to
        percentage = (windowBottom - elementTop) / (elementMid - elementTop);
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