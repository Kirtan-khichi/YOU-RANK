// script.js
$(document).ready(function() {
    $('.slider').each(function() {
      updateSliderColor($(this));
      $(this).on('input', function() {
        updateSliderColor($(this));
      });
    });
  });
  
  function updateSliderColor(slider) {
    var min = parseFloat(slider.attr('min'));
    var max = parseFloat(slider.attr('max'));
    var value = parseFloat(slider.val());
    var percent = (value - min) / (max - min) * 100;
    
    if (value <= 0.1) {
      slider.css('background', 'linear-gradient(to right, #8BC34A 0%, #8BC34A ' + percent + '%, #f1d0d0 ' + percent + '%, #f1d0d0 100%)');
    } else {
      slider.css('background', 'linear-gradient(to right, #8BC34A 0%, #f1d0d0 0%, #f1d0d0 ' + percent + '%, #605746 ' + percent + '%, #605746 100%)');
    }
  }
  