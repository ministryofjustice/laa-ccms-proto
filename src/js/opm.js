'use strict';

var OPM = {};

OPM.styleHiddenContainers = function () {
  var containers = $('#content form').children('.opm-container:hidden').addClass('opm-reveal');
};

OPM.moveNavItems = function () {
  $('.opm-progress-screens')
  .appendTo('.active-stage');
  $('.opm-progress-screens').show();
};

OPM.expandTextAreas = function () {
  var max = 8000;
  $('textarea').each(function (i, el) {
    var textarea = $(el);
    textarea.keyup(function () {
      setTimeout(function () {
        el.style.cssText = 'height:auto;';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
      },0);
    });
    textarea.keydown(function () {
      if (!('maxLength' in el)) {
        if (el.value.length >= max) {
          return false;
        }
      }
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

OPM.helpPrompt = function () {
  var title = $('.help-title');
  title.each(function (i, el) {
    var title = $(el).wrapInner('<span class="summary"/>'),
      title_container = title.closest('.control-item').addClass('help-title-container'),
      content = title_container.next('.control-item').addClass('help-content-container');

    title.on('click', function () {
      content.toggle();
      $(el).toggleClass('active');
    });
  });
}

OPM.applyErrorClass = function () {
  var anchor = $('.error'),
    container = anchor.closest('.control-item');
  container.addClass('error-container');
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
  if ($('.help-title')) {
    OPM.helpPrompt();
  }
  if($('.messages').children('.error').length) {
    OPM.applyErrorClass();
  }
});
