/* ========================================================================
 * fader.js
 * by Justin Wang, 2014
 * ======================================================================== */


+function ($) {
  'use strict';

  var defaults = {
    opacityStart: 0.18,
    opacityEnd: 0.72,
    selector: '.post-cover-fader'
  };

  $.fn.fader = function (options) {

    var settings = $.extend(defaults, options);

    var updateOpacity = function () {

      var top = $(window).scrollTop();
      $(settings.selector).each(function () {
        var $fader = $(this);
        var faderTop = $fader.offset().top;
        var faderBottom = faderTop + $fader.outerHeight();
        $fader.css('opacity', pos2Opacity(top, faderTop, faderBottom));
      });

    };

    var pos2Opacity = function(windowTop, elementTop, elementBottom) {

      if (windowTop < elementTop) {
        return settings.opacityStart;
      } else if (windowTop < elementBottom) {
        var percentage = (windowTop - elementTop) / (elementBottom - elementTop);
        return percentage * (settings.opacityEnd - settings.opacityStart) + settings.opacityStart;
      } else {
        return settings.opacityEnd;
      }

    };

    $(window).on('scroll', updateOpacity).scroll();

  };

}(jQuery);