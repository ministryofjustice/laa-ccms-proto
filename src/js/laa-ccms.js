'use strict';

var OPM = {};

OPM.styleHiddenContainers = function () {
  var containers = $('.opm-container:hidden').addClass('opm-reveal');
};

OPM.moveNavItems = function () {
  $('.opm-progress-screens')
  .appendTo('.active-stage');
};

OPM.expandTextAreas = function () {
  $('textarea').each(function (i, el) {
    var textarea = $(el);
    textarea.keyup(function () {
      setTimeout(function () {
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
      },0);
    });
  });
};

OPM.moveSubmitButtons = function () {
  var back_button = $('#back-button');
  back_button.clone().insertAfter('#submit');
  back_button.remove();
};

OPM.toggleCheckedClass = function (input, label) {
  var is_radio = input.is(':radio'),
    change_class = 'selected',
    focusblur_class = 'add-focus';

  input.on('change', function () {
    var is_checked = input.is(':checked');

    if(is_checked && is_radio) {
      label.siblings('label:visible')
      .removeClass(change_class);
    }

    label.toggleClass(change_class, is_checked);
  })
  .on('focus', function(){
    label.addClass(focusblur_class);
  })
  .on('blur', function(){
    label.removeClass(focusblur_class);
  })
  .change();
}

OPM.buildGDScheckboxes = function () {
  var control = $('.control-checkbox');

  control.each(function (i, el) {
    var container = $(el),
      checkbox = container.find('input:checkbox'),
      label = container.find('label')
      .addClass('block-label')
      .removeClass('question')
      .prepend(checkbox);
    OPM.toggleCheckedClass(checkbox, label);
  });
};

OPM.buildGDSradios = function () {
  var container = $('.radio-group-boolean').wrapInner('<fieldset class="inline"/>'),
    inputs = container.find('input:radio');

  inputs.each(function (i, el) {
    var radio = $(el),
      label = container.find('label[for="'+ el.id +'"]')
      .addClass('block-label')
      .prepend(radio);
    OPM.toggleCheckedClass(radio, label);
  });


}

$(function () {
  $(document.documentElement).addClass('js-enabled laa-ccms');
  OPM.moveSubmitButtons();
  OPM.expandTextAreas();
  OPM.moveNavItems();
  OPM.styleHiddenContainers();
  if ($('.control-checkbox').length) {
    OPM.buildGDScheckboxes();
  }
  if ($('.radio-group-boolean').length) {
    OPM.buildGDSradios();
  }
});
