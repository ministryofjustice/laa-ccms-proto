'use strict';

var LAA = {};

LAA.fixUIgubbins = function () {
  $('.opm-progress-screens')
  .appendTo('.active-stage');
  // $('.button-spacer, .submit-break').remove();

  $('textarea').each(function (i, el) {
    var textarea = $(el);
    textarea.keydown(function () {
      setTimeout(function () {
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
      },0);
    });
  });
}

LAA.moveSubmitButtons = function () {
  var buttons = $('.opm-submit-buttons'),
    form = $('#content');

  buttons.appendTo(form);
};

LAA.toggleCheckedClass = function (input, label) {
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

LAA.buildGDScheckboxes = function () {
  var control = $('.control-checkbox');

  control.each(function (i, el) {
    var container = $(el),
      checkbox = container.find('input:checkbox'),
      label = container.find('label')
      .addClass('block-label')
      .removeClass('question')
      .prepend(checkbox);
    LAA.toggleCheckedClass(checkbox, label);
  });
};

LAA.buildGDSradios = function () {
  var container = $('.radio-group-boolean').wrapInner('<fieldset class="inline"/>'),
    input = container.find('input:radio');

  input.each(function (i, el) {
    var radio = $(el),
      label = container.find('label[for="'+ el.id +'"]:visible')
      .addClass('block-label')
      .prepend(radio);
    LAA.toggleCheckedClass(radio, label);
  });


}

$(function () {
  $(document.documentElement).addClass('js-enabled laa-ccms');
  if ($('.control-checkbox').length) {
    LAA.buildGDScheckboxes();
  }
  if ($('.radio-group-boolean').length) {
    LAA.buildGDSradios();
  }
  // LAA.moveSubmitButtons();
  LAA.fixUIgubbins();
});
