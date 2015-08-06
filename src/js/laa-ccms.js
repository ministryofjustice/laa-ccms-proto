'use strict';

var LAA = {};

LAA.init = function () {
  if ($('.control-checkbox').length) {
    LAA.buildGDScheckboxes();
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

LAA.toggleCheckedClass = function (checkbox, label) {
  var change_class = 'selected',
    focusblur_class = 'add-focus';

  checkbox.on('change', function () {
    var is_checked = checkbox.is(':checked');
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

$(function () {
  LAA.init();
});
