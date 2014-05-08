/* ========================================================================
 * translator.js
 * by Justin Wang, 2014
 * ======================================================================== */


+function ($) {
  'use strict';

  var defaults = {
    selector: '.post-cover-image'
  };

  $.fn.translator = function (options) {

    var settings = $.extend(defaults, options);

    var updateTranslate = function () {

      var top = $(window).scrollTop();
      $(settings.selector).each(function () {
        var $cover = $(this);
        var coverTop = $cover.offset().top;
        var coverBottom = coverTop + $cover.outerHeight();
        $cover.css('background-position-y', pos2Percent(top, coverTop, coverBottom) + '%');
      });

    };

    var pos2Percent = function(windowTop, elementTop, elementBottom) {

      if (windowTop < elementTop) {
        return 50;
      } else if (windowTop < elementBottom) {
        return  (elementBottom - windowTop) / (elementBottom - elementTop) * 50;
      } else {
        return 0;
      }

    };

    $(window).on('scroll', updateTranslate).scroll();

  };

}(jQuery);