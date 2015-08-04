//JQuery UI implementation of a searching combobox
(function ($) {
    $.widget("ui.combobox", {
        options:{
            width:null,
            extraClasses:[],
            hintText:null,
            hintClass:"opa-hint-text",
            clearSelection:false
        },
        _create:function () {
            var self = this,
                customStyles = this.element.context.style.cssText,
                select = this.element.hide(),
                optToItem = function (opt, searchTerm) {
                    var encodedText = opt.text !== "" ? htmlEncode(opt.text) : "&nbsp;";
                    var encodedSearch = $.ui.autocomplete.escapeRegex(htmlEncode(searchTerm));
                    var regex = new RegExp("(" + encodedSearch + ")", "gi");
                    return {
                        label:encodedSearch.length > 0 ? encodedText.replace(regex, "<strong>$1</strong>") : encodedText,
                        value:opt.text,
                        option:opt
                    }
                };
            var init = true;

            var hintOpt = null;
            var defaultOpt = null;

            //if there is hint text add it as an option
            if (this.options.hintText !== null) {
                var newOpt = $("<option value=\"\">" + this.options.hintText + '\xA0' + "</option>");
                select.prepend(newOpt);
                defaultOpt = hintOpt = newOpt[0];
            } else {
                var opts = select.children("option");
                //make sure there is a blank default option
                for (var i = 0; i < opts.length; ++i) {
                    if (opts[i].value === "") {
                        defaultOpt = opts[i];
                        break;
                    }
                }

                if (defaultOpt === null) {
                    //no default blank option so create one
                    var newOpt = $("<option value=\"\">&nbsp;</option>");
                    select.prepend(defaultOpt);
                    defaultOpt = newOpt[0];
                }
            }

            if (this.options.clearSelection) {
                defaultOpt.selected = true;
            }

            var selected = select.children(":selected");
            var options = select.children("option");
            var value = selected.text() && $.trim(selected.text()) !== "" ? selected.text() : "";

            var ctrlSpan = $("<span style=\"white-space:nowrap\"></span>")
                .insertAfter(select);

            var hintClass = this.options.hintClass;
            var input = this.input = $("<input>")
                .appendTo(ctrlSpan)
                .val(value)
                .focus(function () {
                    if ($.trim(input.val()) === '') {
                        input.val('');
                    }

                    self.removeHint();
                })
                .autocomplete({
                    delay:0,
                    minLength:0,
                    source:function (request, response) {
                        var maxResults = searchingComboboxes.maxResults;
                        var startMatches = new Array();
                        var containsMatches = new Array();

                        var search = !request.term ? "" : request.term.toLowerCase();

                        var truncResults = false;
                        for (var i = 0; i < options.length; ++i) {
                            var opt = options[i];

                            //hint text is not selectable
                            if (hintOpt !== null && opt.text === hintOpt.text) {
                                continue;
                            }

                            var idx = opt.text.toLowerCase().indexOf(search);
                            if (idx == 0) {
                                if (maxResults > 0 && startMatches.length >= maxResults) {
                                    truncResults = true;
                                    break;
                                }
                                startMatches.push(optToItem(opt, request.term));
                            } else if (idx > 0) {
                                containsMatches.push(optToItem(opt, request.term));
                            }

                        }

                        if (maxResults <= 0 || startMatches.length + containsMatches.length <= maxResults) {
                            startMatches = startMatches.concat(containsMatches);
                        } else if (startMatches.length < maxResults) {
                            truncResults = true;
                            var end = maxResults - startMatches.length;
                            for (var i = 0; i < end; ++i) {
                                startMatches.push(containsMatches[i]);
                            }
                        }

                        if (truncResults) {
                            startMatches.push({
                                label:"<strong>" + searchingComboboxes.moreResultsText + "</strong>",
                                value:"___MAX___"
                            })
                        }

                        response(
                            startMatches
                        );
                    },
                    select:function (event, ui) {
                        if (ui.item.value == "___MAX___")
                            return false;

                        ui.item.option.selected = true;
                        if (unsubmittedDataWarning.isEnabled) {
                            owdMakeDirty();
                        }

                        self._trigger("selected", event, {
                            item:ui.item.option
                        });

                        $(select).trigger("change");
                    },
                    change:function (event, ui) {
                        if (!ui.item) {
                            var displayText = $(this).val();
                            var valid = false;
                            for (var i = 0; i < options.length; ++i) {
                                var opt = options[i];
                                var match = (opt.text === displayText);
                                if (match) {
                                    opt.selected = true;
                                    valid = true;
                                    selected = opt;
                                    break;
                                }
                            }

                            if (!valid) {
                                // remove invalid value, as it didn't match anything
                                defaultOpt.selected = true;
                                $(input).val(defaultOpt.text);
                                input.data("ui-autocomplete").term = "";

                                return false;
                            }
                        }
                        //unsumbitted data warning
                        if (!init && unsubmittedDataWarning.isEnabled && input.data("ui-autocomplete").isSubmitting !== true) {
                            owdMakeDirty();
                        }

                        $(select).trigger("change");
                    },
                    focus:function (event, ui) {
                        if (ui.item.value == "___MAX___")
                            return false;
                    },
                    close:function () {
                        if ($.trim(input.val()) === '') {
                            input.val('');
                        }

                        input.attr("aria-expanded", "false");
                    },
                    open:function(){
                        input.attr("aria-expanded", "true");
                   }
                })
                .addClass("ui-widget ui-widget-content")
                .focus(function () {

                })
                .blur(function () {
                    self.addHint();
                })

            this.removeHint = function () {
                input.removeClass(hintClass);
                if (hintOpt !== null && input.val() === hintOpt.text) {
                    input.val("");
                }
            }

            this.addHint = function () {
                if (hintOpt !== null && (input.val() === "" || input.val() === hintOpt.text)) {
                    input.addClass(hintClass);
                    input.val(hintOpt.text);
                }
            }

            input.blur();
            var selectId = select.attr("id");
            input.attr("id", "___cmbinput___" + selectId);

            input.data("ui-autocomplete")._renderItem = function (ul, item) {
                return $("<li></li>")
                    .data("item-autocomplete-item", item)
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
            };

            //set tab index
            input.attr("tabindex", select.attr("tabindex"));

            //transfer any aria attributes
            var attrs = select[0].attributes;
            for(var i = 0; i < attrs.length; ++i){
                var attr = attrs[i];
                if(attr.name.indexOf("aria") == 0)
                    input.attr(attr.name, attr.value);
            }

            //set additional aria attributes
            input.attr("role", "combobox");
            input.attr("aria-autocomplete", "list");
            input.attr("aria-expanded", "false");


            if (this.options.width !== null && this.options.width > 0)
                input.width(this.options.width > 25 ? this.options.width : 25);

            var button = this.button = $("<button type='button'>&nbsp;</button>")
                .attr("tabIndex", -1)
                .attr("title", searchingComboboxes.triggerTooltip)
                .attr("aria-label", searchingComboboxes.triggerTooltip)
                .insertAfter(input)
                .button({
                    icons:{
                        primary:"ui-icon-triangle-1-s"
                    },
                    text:false
                })
                .removeClass("ui-corner-all")
                .click(function () {
                    // close if already visible
                    if (input.autocomplete("widget").is(":visible")) {
                        input.autocomplete("close");
                        return;
                    }

                    $(this).blur();

                    // pass empty string as value to search for, displaying all results
                    input.autocomplete("search", "");
                    input.focus();
                });

            if (this.element.context.disabled) {
                this.input.attr('disabled', 'disabled');
                this.button.attr('disabled', 'disabled');

                this.input.removeClass("ui-state-content");
                this.button.removeClass("ui-state-default");

                this.input.addClass("ui-state-disabled");
            } else {
                //If there is a blank value in the list, make it the default
                for (var i = 0; i < options.length; ++i) {
                    var opt = options[i];
                    if (opt.value === "") {
                        defaultOpt = opt;
                        break;
                    }
                }
            }

            //apply custom classes and styles
            var classes = select.context.className.split(' ');
            for (var i = 0; i < classes.length; ++i) {
                if (classes[i] && classes[i] !== "owd-input") {
                    input.addClass(classes[i]);
                    input.data("ui-autocomplete").menu.element.addClass(classes[i]);
                    button.addClass(classes[i]);
                }
            }
            for (var i = 0; i < this.options.extraClasses.length; ++i) {
                input.addClass(this.options.extraClasses[i]);
                button.addClass(this.options.extraClasses[i]);
            }

            if (customStyles) {
                var styles = customStyles.split(';');
                for (var i = 0; i < styles.length; ++i) {
                    var s = styles[i].split(':');
                    if (s && s.length == 2) {
                        var key = $.trim(s[0]);
                        var val = $.trim(s[1]);
                        input.css(key, val);
                        input.data("ui-autocomplete").menu.element.css(key, val);
                        button.css(key, val);
                    }
                }
            }

            init = false;

        },
        disabled:function (disabled) {
            if (disabled) {
                this.removeHint();
                this.input.attr("disabled", true);
                this.button.attr("disabled", true);
                this.input.removeClass("ui-state-content");
                this.button.removeClass("ui-state-default");

                this.input.addClass("ui-state-disabled");
            } else {
                this.addHint();
                this.input.removeAttr("disabled", false);
                this.button.removeAttr("disabled", false);

                this.input.addClass("ui-state-content");
                this.button.addClass("ui-state-default");
                this.input.removeClass("ui-state-disabled");
            }

        },
        destroy:function () {
            this.input.remove();
            this.button.remove();
            this.element.show();
            $.Widget.prototype.destroy.call(this);
        }
    });
})($);


$.widget("opa.hintText", {
    options:{
        hintText:"",
        hintClass:"opa-hint-text"
    },
    _create:function () {
        var self = this.self = $(this.element);
        //add a non-breaking space to the hint text so the comparison fails if the user happens to enter the same thing as the hint text
        var hintText = this.options.hintText + '\xA0';
        var hintClass = this.options.hintClass;

        self.isDisabled = false;

        this.addHint = function () {
            if (!self.isDisabled) {
                if (self.val() === '' || self.val() === hintText) {
                    self.val(hintText);
                    self.addClass(hintClass);
                } else {
                    self.removeClass(hintClass);
                }
            }

        };
        this.removeHint = function () {
            if (self.val() === hintText)
                self.val('');

            self.removeClass(hintClass);
        }


        self.change(this.addHint);

        self.blur(this.addHint);
        self.focus(this.removeHint);
        self.blur();
    },
    disabled:function (disabled) {
        this.self.isDisabled = disabled;

        if (disabled) {
            this.removeHint();
        } else {
            this.addHint();
        }

    },

    destroy:function () {
        this.removeHint();
        $.Widget.prototype.destroy.call(this);
    }

});



    
