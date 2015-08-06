'use strict';

var LAA = {};

LAA.init = function () {
  if ($('.control-checkbox').length) {
    LAA.buildGDScheckboxes();
  }
  if ($('.radio-group-boolean').length) {
    LAA.buildGDSradios();
  }

  LAA.moveSubmitButtons();
  LAA.fixUIgubbins();
};

LAA.fixUIgubbins = function () {
  $('.button-spacer, .submit-break').remove();
}

LAA.moveSubmitButtons = function () {
  var buttons = $('.opm-submit-buttons'),
    form = $('#content');

  buttons.appendTo(form);
};

LAA.buildGDScheckboxes = function () {
  var control = $('.control-checkbox');

  control.each(function (i, el) {
    var container = $(el),
      checkbox = container.find('input:checkbox'),
      label = container.find('label')
        .addClass('block-label')
        .removeClass('question');
    checkbox.prependTo(label);
    LAA.toggleCheckedClass(checkbox, label);
  });
};

LAA.toggleCheckedClass = function (input, label) {
  var is_radio = input.is(':radio'),
    change_class = 'selected',
    focusblur_class = 'add-focus';

  input.on('change', function () {
    var is_checked = input.is(':checked');

    if(is_checked && is_radio) {
      var siblings = label.parent('.block-label').siblings().find('label');
      siblings.removeClass(change_class);
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

LAA.buildGDSradios = function () {
  var container = $('.radio-group-boolean').wrapInner('<fieldset class="inline"/>'),
    input = container.find('input:radio');

  input.each(function (i, el) {
    var radio = $(el),
      label = container.find('label[for="'+ el.id +'"]:visible').wrap('<div class="block-label"/>');

    radio.prependTo(label);
    LAA.toggleCheckedClass(radio, label);
  });


}

$(function () {
  LAA.init();
});
