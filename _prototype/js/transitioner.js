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
    fadeMid: 0.3,
    fadeEnd: 0.7
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

      if (windowBottom < elementTop) { // image not scrolled to
        return 0;
      } else if (windowBottom < elementBottom) { // image partly scrolled to
        percentage = (windowBottom - elementTop) / (elementBottom - elementTop);
        return percentage;
      } else { // image scrolled past
        return 1;
      }

    };

    var pos2FaderOpacity = function(windowTop, windowBottom, elementTop, elementBottom) {

      var percentage;
      // var elementMid = (4*elementBottom + elementTop) / 5;
      var elementMid = elementBottom;

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