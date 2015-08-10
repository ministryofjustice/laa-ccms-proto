$(function () {
    var stages = stageData.stages;
    var screens = stageData.screens;

    var stagesSelectMobile = jQuery("#stages-select-mobile");
    var screenSelectMobile = jQuery("#screen-select-mobile");
    var stagesDefaultIndex = 0, screensDefaultIndex = 0;

    function stagesNavigate() {
        var idx = parseInt(stagesSelectMobile.val());
        alert(stages[idx].url);
    }

    function enableSelectAccessibility(select, defaultIndex, changeHandler) {
        var keyboarded = false;

        select.keydown(function (evt) {
            if (evt.which == 9 || evt.which == 13) {
                changeHandler();
            } else if (evt.which == 27) {
                select.val(defaultIndex);
            } else {
                keyboarded = true;
            }
        });

        select.change(function () {
            if (!keyboarded)
                changeHandler();
        });

        select.click(function () {
            keyboarded = false;
        });
    }

    for (var idx = 0; idx < stages.length; idx++) {
    	if (stages[idx].url != "" || stages[idx].kind == "active-stage") {
	        var opt = new Option(htmlDecode(stages[idx].text));
	        opt.className = stages[idx].kind;
	        if (stages[idx].kind == "active-stage") {
	            opt.selected = true;
	            stagesDefaultIndex = idx;
	        }
	        opt.value = idx;
	        stagesSelectMobile.append(opt);
    	}
    }

    for (var idx = 0; idx < screens.length; idx++) {
    	if (screens[idx].url != "" || screens[idx].kind == "active-screen") {
	        var opt = new Option(htmlDecode(screens[idx].text));
	        opt.className = screens[idx].kind;
	        if (screens[idx].kind == "active-screen") {
	            opt.selected = true;
	            screensDefaultIndex = idx;
	        }
	        opt.value = idx;
	        screenSelectMobile.append(opt);
    	}
    }
    enableSelectAccessibility(stagesSelectMobile, stagesDefaultIndex, function () {
        var idx = parseInt(stagesSelectMobile.val());
        if (idx != stagesDefaultIndex && stages[idx].url != "")
            window.location.href = stages[idx].url;
    });
    enableSelectAccessibility(screenSelectMobile, screensDefaultIndex, function () {
        var idx = parseInt(screenSelectMobile.val());
        if (idx != screensDefaultIndex)
            window.location.href = screens[idx].url;
    });

    jQuery("#wrapper").addClass("opa-responsive-stages");
});

var owdMarkPageAsDirty;

if (unsubmittedDataWarning.isEnabled) {
    var owdPageIsDirty = false;
    var owdPageIsAlwaysDirty = unsubmittedDataWarning.hasUnsubmitted;
    var owdInputControls = [];
    var owdInputKinds = [];
    var owdInputDefaults = [];

    function owdControlValue(ctl, kind) {
        if (kind == "input" && (ctl.type == "radio" || ctl.type == "checkbox"))
            return ctl.checked;
        return ctl.value;
    }

    function owdMakeDirty() {
        var pageIsActuallyDirty = owdPageIsAlwaysDirty;
        var idx, ctl;

        for (idx = 0; idx < owdInputControls.length; idx++) {
            ctl = owdInputControls[idx];
            if (owdControlValue(ctl, owdInputKinds[idx]) !== owdInputDefaults[idx]) {
                pageIsActuallyDirty = true;
                break;
            }
        }

        if (!owdPageIsDirty && pageIsActuallyDirty) {
            window.onbeforeunload = function () {
                return unsubmittedDataWarning.warningMsg;
            }
        } else if (owdPageIsDirty && !pageIsActuallyDirty) {
            window.onbeforeunload = null;
        }
        owdPageIsDirty = pageIsActuallyDirty;
    }

    owdMarkPageAsDirty = function() {
    	owdPageIsAlwaysDirty = true;
    	owdMakeDirty();
    }

//attach event handlers
    jQuery(function () {
        jQuery("#owdInterviewForm").submit(function () {
            if (owdPageIsDirty) {
                owdPageIsDirty = false;
                window.onbeforeunload = null;
            }
        });

        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].className.indexOf("owd-input") >= 0) {
                owdInputControls.push(inputs[i]);
                owdInputKinds.push("input");
                owdInputDefaults.push(owdControlValue(inputs[i], "input"));
                inputs[i].onchange = function () {
                    owdMakeDirty();
                }
            }
        }

        var selects = document.getElementsByTagName("select");
        for (var i = 0; i < selects.length; i++) {
            if (selects[i].className.indexOf("owd-input") >= 0) {
                owdInputControls.push(selects[i]);
                owdInputKinds.push("select");
                owdInputDefaults.push(owdControlValue(selects[i], "select"));
                selects[i].onchange = function () {
                    owdMakeDirty();
                }
            }
        }

        if (owdPageIsAlwaysDirty && owdInputControls.length > 0) {
            owdMakeDirty();
        }

    });

}

$(function () {
    var oldWidth = $(window).width();

    var toggleTableStyle = function () {
        $(".owd-table-ent-inst").each(function () {
            var instRow = $(this);
            var removeCell = instRow.find(".owd-remove-inst-cell");

            if (instRow.css('display') !== 'block') {
                var removeButWidget = instRow.find(".owd-entity-table-remove")[0];
                $(removeButWidget).removeClass("entity-instance-widget");

                removeCell.append(removeButWidget);
                removeCell.removeClass("owd-entity-table-messages");

            } else {
                var removeButWidget = instRow.find(".owd-entity-table-remove")[0];
                $(removeButWidget).addClass("entity-instance-widget");
                instRow.prepend(removeButWidget);
                removeCell.addClass("owd-entity-table-messages");
            }
        });

    }

    if (oldWidth <= 400) {
        toggleTableStyle();
    }

    $(window).resize(function () {
        if (($(window).width() <= 400 && oldWidth > 400) || ($(window).width() > 400 && oldWidth <= 400)) {
            toggleTableStyle();
        }

        oldWidth = $(window).width();
    });


});


//Java script controls
$(function () {
    function unhide(jqueryEl){
        var elsToHide = [];
        if(!jqueryEl.is(':visible')){
            jqueryEl.parents("div.control-item, div.opm-container").each(function(){
                var parent = $(this);
                if(parent.css('display') === 'none'){
                    elsToHide.push(parent);
                    parent.css('display', '');
                }
            });
        }

        return elsToHide;
    }

    function hideAll(elsToHide){
        for(var i = 0; i < elsToHide.length; ++i){
            elsToHide[i].css('display', 'none');
        }
    }

    $.datepicker.setDefaults(datePickerOpts);

    var calendarCtrls = [];
    var hintWidgets = [];

    for (var i = 0; i < screenInfo.controls.length; ++i) {
        var ctrlData = screenInfo.controls[i];


        if (ctrlData.inputType === "Calendar") {
            calendarCtrls.push(ctrlData);

            var input = $('[name="' + ctrlData.name + '"]');
            var el = input[0];

            //if we're going to render a trigger icon, adjust the size of the control
            if (datePickerOpts.showOn === "both") {
                input.css('max-width', '227px');
                input.wrap('<span style="white-space:nowrap" />');
            }

            input.datepicker();

            if (ctrlData.readOnly)
                input.datepicker('disable');

            if (ctrlData.dayVal !== "") {
                //set date
                var val = new Date(ctrlData.yearVal, ctrlData.monthVal - 1, ctrlData.dayVal, 0, 0, 0, 0);
                input.datepicker('setDate', val);
            }

            $("<input type=\"hidden\" name=\"" + ctrlData.dayName + "\">").insertAfter(el);
            $("<input type=\"hidden\" name=\"" + ctrlData.monthName + "\">").insertAfter(el);
            $("<input type=\"hidden\" name=\"" + ctrlData.yearName + "\">").insertAfter(el);

            if (ctrlData.hasHintText) {
                input.hintText({ hintText:ctrlData.hintText});
                hintWidgets.push(input);
            }
        } else if (ctrlData.inputType === "dmy-inputs") {

            var daySelect = $('[name="' + ctrlData.dayName + '"]');

            var elsToHide = unhide(daySelect);

            if(!daySelect.is(':visible')){

            }

            var opts = {
                extraClasses:["searching-combo"]
            };

            opts.width = $(daySelect).width() - 20;
            opts.hintText = ctrlData.hasHintText ? ctrlData.dayHintText : null;
            jQuery(daySelect).combobox(opts);

            var monthSelect = $('[name="' + ctrlData.monthName + '"]');
            opts.width = $(monthSelect).width() - 20;
            opts.hintText = ctrlData.hasHintText ? ctrlData.monthHintText : null;
            monthSelect.combobox(opts);

            if (ctrlData.hasHintText) {
                var yearInput = $('[name="' + ctrlData.yearName + '"]');
                yearInput.hintText({hintText:ctrlData.yearHintText});
                hintWidgets.push(yearInput);
            }

            hideAll(elsToHide);

        } else if (ctrlData.inputType === "searching-combo") {
            var select = $('[name="' + ctrlData.name + '"]');

            var elsToHide = unhide(select);

            var opts = {
                extraClasses:["searching-combo"],
                clearSelection:ctrlData.displayValue.length == 0
            };

            if (ctrlData.hasHintText) {
                opts.hintText = ctrlData.hintText;

            }
            select.combobox(opts);

            hideAll(elsToHide);

        } else if (ctrlData.hasHintText) {
            var input = $('[name="' + ctrlData.name + '"]');
            input.hintText({hintText:ctrlData.hintText});
            hintWidgets.push(input);
        }
    }

    $("#owdInterviewForm").submit(function () {
        var widget;
        while ((widget = hintWidgets.pop()) !== undefined) {
            widget.hintText('destroy');
        }

        var ctrlData;
        while ((ctrlData = calendarCtrls.pop()) !== undefined) {
            var txtVal = $('[name="' + ctrlData.name + '"]').val();
            var dateVal = null;

            try {
                if (txtVal !== '') {
                    dateVal = $.datepicker.parseDate(datePickerOpts.dateFormat, txtVal);
                }
            } catch (e) {
                //assume date value is invalid
                dateVal = null;
            }


            if (dateVal !== null) {
                $('[name = "' + ctrlData.dayName + '"]').val(dateVal.getDate());
                $('[name = "' + ctrlData.monthName + '"]').val(dateVal.getMonth() + 1);
                $('[name = "' + ctrlData.yearName + '"]').val(dateVal.getFullYear());
            }
        }

    });
});

//handle back button
jQuery("body").on("click", ".owd-back", function() {
    window.location.href = screenInfo.backButtonURL;
});

//explanations
jQuery(function () {
    jQuery('.explanation').each(function () {
        var caption = jQuery('.explanation_caption', this);
        var imgNode = caption.children('img').first();
        var details = jQuery('.explanation_details', this);

        //non-empty decision report
        if (details.length !== 0) {
            details.hide();

            var anchor = caption.children('.explanation-node-text').first();
            //initialise the caption
            anchor.addClass('explanation-tree-parent');
            caption.click(function (event) {
                details.toggle('blind');
                var src = imgNode.attr('src') == explanationParams.captionCollapseImage ? explanationParams.captionExpandImage : explanationParams.captionCollapseImage;
                var alt = src == explanationParams.captionCollapseImage ? explanationParams.nodeCollapseAlt : explanationParams.nodeExpandAlt
                imgNode.attr('src', src);
                imgNode.attr('alt', alt);
            });

            anchor.keydown(function (event) {
                // handle cursor keys
                if (event.keyCode == 37) {
                    details.hide('blind');
                    imgNode.attr('src', explanationParams.captionExpandImage).attr('alt', explanationParams.nodeExpandAlt);
                }
                if (event.keyCode == 39) {
                    details.show('blind');
                    imgNode.attr('src', explanationParams.captionCollapseImage).attr('alt', explanationParams.nodeCollapseAlt);
                }
            });
            anchor.click(function (event) {
                event.preventDefault();
            })

            //initialise every node in the decision report
            jQuery('li', details).each(function () {
                var node = jQuery(this);
                var childContent = jQuery(this).children('ul').first();
                var imgNode = node.children("img").first();
                var anchor = node.children('.explanation-node-text').first();

                node.click(function (event) {
                    if(childContent.length !== 0) {
                        childContent.toggle('blind');
                        var src = imgNode.attr('src') === explanationParams.nodeExpandImage ? explanationParams.nodeCollapseImage : explanationParams.nodeExpandImage;
                        var alt = src === explanationParams.nodeExpandImage ? explanationParams.nodeExpandAlt : explanationParams.nodeCollapseAlt;
                        imgNode.attr('src', src).attr('alt', alt);
                    }
                    event.stopPropagation();
                });

                anchor.click(function (event) {
                    //this will stop the browser history from expand/contract something
                    event.preventDefault();
                });

                if (childContent.length !== 0) {
                    childContent.hide();
                    imgNode.attr('src', explanationParams.nodeExpandImage).attr('alt', explanationParams.nodeExpandAlt);

                    anchor.addClass('explanation-tree-parent');
                    anchor.keydown(function (event) {
                        // handle cursor keys
                        if (event.keyCode == 37) {
                            childContent.hide('blind');
                            imgNode.attr('src', explanationParams.nodeExpandImage).attr('alt', explanationParams.nodeExpandAlt);
                            event.stopPropagation()
                        } else if (event.keyCode == 39) {
                            childContent.show('blind');
                            imgNode.attr('src', explanationParams.nodeCollapseImage).attr('alt', explanationParams.nodeCollapseAlt);
                            event.stopPropagation()
                        }

                    });

                }


                //handling for the "see above for proof"
                var prevNodeRef = node.children('.explanation-proven-ref');

                if (prevNodeRef.length !== 0) {
                    prevNodeRef.click(function (event) {
                        //ie #somenodeid
                        var refNodeId = prevNodeRef.attr('href');

                        var referencedNode = jQuery(refNodeId, details);
                        var listNode = referencedNode.children('ul').first();
                        var imgNode = referencedNode.children('img').first();

                        var owningList = referencedNode.parent();
                        //if the node isn't currently visible we'll animate its expansion
                        if (owningList.is('ul') && !owningList.is(":visible") && listNode.length === 1) {
                            listNode.hide();
                            imgNode.attr('src', explanationParams.nodeExpandImage).attr('alt', explanationParams.nodeExpandAlt);
                        }

                        //make sure the node is visible
                        while (owningList.is('ul') && !owningList.is(":visible")) {
                            owningList.show();
                            owningList.parent().children('img').first().attr('src', explanationParams.nodeCollapseImage).attr('alt', explanationParams.nodeCollapseAlt);
                            owningList = owningList.parent().parent();
                        }

                        //go to it
                        jQuery('html, body').animate(
                            {scrollTop:referencedNode.offset().top},
                            1, "swing",
                            function () {
                                if (listNode.length === 1) {
                                    //auto expand node
                                    listNode.show('blind');
                                    imgNode.attr('src', explanationParams.nodeCollapseImage).attr('alt', explanationParams.nodeCollapseAlt);
                                }
                            });

                        //stop the link going into the browser history
                        event.preventDefault();
                    });
                }

            });
        }
    });
});

//default buttons
$(function () {
    var defaultSubmit = $('button[type="submit"][name="submit"]');

    if (defaultSubmit.length === 1) {
        $("input").keypress(function (e) {
            if (e.keyCode === 13) {
                $(e.delegateTarget).blur();
                defaultSubmit.click();
                return false;
            } else {
                return true;
            }
        });
    }
});

if (dynamicControlStateEnabled) {
    //evaluate dynamic conditions
    $(function () {
        function getValue(ctrl, dataType){
            var stringVal;

            if (ctrl.is('input[type="radio"]')) {
                for (var i = 0; i < ctrl.length; ++i) {
                    var el = ctrl[i];
                    if (el.checked) {
                        stringVal = el.value;
                        break;
                    }
                }
            } else if (ctrl.is('input[type="checkbox"]')) {
                stringVal = ctrl.is(":checked") ? "true" : "false";
            } else {
                stringVal = ctrl.val();
            }

            stringVal = $.trim(stringVal);

            if(dataType === 1) {
                //boolean val
                if (stringVal === "true" || stringVal.toLowerCase() === dataFormats.bool.trueVal.toLowerCase()) {
                    return true;
                } else if (stringVal === "false" || stringVal.toLowerCase() === dataFormats.bool.falseVal.toLowerCase()) {
                    return false;
                } else {
                    return null;
                }
            }   else if (dataType === 2){
                //for string enumerations, empty string is uncertain, "<!@?opa-blank?@!>" is blank
                if(stringVal === "")
                    return null;
                else if(stringVal === "<!@?opa-blank?@!>")
                    return "";
                else
                    return stringVal;
            } else if(dataType === 4 || dataType === 8) {
                //number val
                if(stringVal === "")
                    return null;
                var doubleVal = parseFloat(stringVal);
                return isNaN(doubleVal) ? null : doubleVal;
            }
        }


        var rules = [];
        var controls = [];
        var ctrlsById = {};
        var stateEngine;

        function initExpr(exprDef) {
            if (exprDef.isConstant) {
                return new OPAControlStateEvaluator.ConstantExpression(exprDef.result);
            } else {
                var ctrl = ctrlsById[exprDef.attrCtrlName];
                if (!ctrl) {
                    var state = screenInfo.controlsByName[exprDef.attrCtrlName].state;
                    ctrl = new OPAControlStateEvaluator.Control(exprDef.attrCtrlName, state);
                    controls.push(ctrl);
                    ctrlsById[ctrl.id] = ctrl;
                }

                if (!ctrl.initForExpr) {
                    ctrl.initForExpr = true;
                    var jqCtrl = $("[name=\"" + exprDef.attrCtrlName + "\"]");
                    ctrl.value = getValue(jqCtrl, exprDef.exprValType);
                    jqCtrl.change(function () {

                        stateEngine.setControlValue(exprDef.attrCtrlName, getValue(jqCtrl, exprDef.exprValType));
                        stateEngine.evaluate();
                    });
                }

                return new OPAControlStateEvaluator.DynamicExpression(exprDef.attrCtrlName, exprDef.exprType, exprDef.exprOp, exprDef.exprVals);
            }
        }

        for (var i = 0; i < controlRules.length; ++i) {
            var ruleDef = controlRules[i];

            var hideIfExpr = initExpr(ruleDef.hideIfExpr);
            var readOnlyIfExpr = initExpr(ruleDef.readOnlyIfExpr);
            var optionalIfExpr = initExpr(ruleDef.optionalIfExpr);

            var rule = new OPAControlStateEvaluator.ControlStateRule(ruleDef.ctrlName, hideIfExpr, readOnlyIfExpr, optionalIfExpr, ruleDef.defaultState);
            rules.push(rule);

            if (!ctrlsById[ruleDef.ctrlName]) {
                var state = screenInfo.controlsByName[ruleDef.ctrlName].state;
                var ctrl = new OPAControlStateEvaluator.Control(ruleDef.ctrlName, state);
                controls.push(ctrl);
                ctrlsById[ctrl.id] = ctrl;
            }

        }

        stateEngine = new OPAControlStateEvaluator.Engine(rules, controls);
        stateEngine.onStateChange = function (controls) {
            for (var i = 0; i < controls.length; ++i) {
                var ctrl = controls[i];
                var ctrlInfo = screenInfo.controlsByName[ctrl.id];

                var state = ctrl.state;
                var div = $("#cd-" + ctrlInfo.id.replace(".", "\\."));
                var ctrlType = ctrlInfo.type;
                var inputType = ctrlInfo.inputType;

                if (state === "hidden") {
                    if (div.hasClass("owd-entity-table-cell")) {
                        div.children("div").hide();
                        div.addClass("owd-responsive-hide");

                        var msgCell = $("#cmc-" + ctrlInfo.id.replace(".", "\\."));
                        if (msgCell.length > 0) {
                            msgCell.children("div").hide();
                            msgCell.addClass("owd-responsive-hide")
                        }
                    } else {
                        div.hide();
                    }

                    div.find("[aria-hidden]").attr("aria-hidden", "true").attr("aria-disabled", "false").attr("aria-required", "false");
                } else {
                    if (state === "enabled") {
                        div.find("img.mandatory").show();
                        div.find("img.mandatory-table").show();
                        if (ctrlType === "BooleanInputControl") {
                            var uncertainOpt = div.find('input[type="radio"][value=""]');
                            if (uncertainOpt) {
							    uncertainOpt.attr("style", "display: none");
							    uncertainOpt.hide();
                                div.find('label[id="' + uncertainOpt.attr('aria-labelledby') + '"]').hide();
                            }
                        }
                        div.find("[aria-hidden]").attr("aria-hidden", "false").attr("aria-disabled", "false").attr("aria-required", "true");
                    } else {
                        div.find("img.mandatory").hide();
                        div.find("img.mandatory-table").hide();
                        if (ctrlType === "BooleanInputControl") {
                            var uncertainOpt = div.find('input[type="radio"][value=""]');
                            if (uncertainOpt) {
							    uncertainOpt.attr("style", "");
								uncertainOpt.show();
                                div.find('label[id="' + uncertainOpt.attr('aria-labelledby') + '"]').show();
                            }
                        }

                        div.find("[aria-hidden]").attr("aria-hidden", "false").attr("aria-required", "false");

                    }

                    var isReadOnly = state === "readonly";

                    if(isReadOnly)
                        div.find("[aria-hidden]").attr("aria-disabled", "true")
                    else
                        div.find("[aria-hidden]").attr("aria-disabled", "false")

                    if (inputType === "Calendar") {
                        var input = $('[name="' + ctrlInfo.name + '"]');
                        input.datepicker("option", "disabled", isReadOnly);
                        if (ctrlInfo.hasHintText) {
                            input.hintText("disabled", isReadOnly);
                        }

                        if (!isReadOnly) {
                            input.removeAttr("readonly");
                        }

                    } else if (inputType === "dmy-inputs") {
                        $('[name="' + ctrlInfo.dayName + '"]').combobox("disabled", isReadOnly);
                        $('[name="' + ctrlInfo.monthName + '"]').combobox("disabled", isReadOnly);

                        var yearInput = $('[name="' + ctrlInfo.yearName + '"]');
                        if (ctrlInfo.hasHintText)
                            yearInput.hintText("disabled", isReadOnly);

                        if (isReadOnly)
                            yearInput.attr("readonly", true);
                        else
                            yearInput.removeAttr("readonly");
                    } else if (inputType === "searching-combo") {
                        $('[name="' + ctrlInfo.name + '"]').combobox("disabled", isReadOnly);
                    } else {
                        div.find(":input").each(function () {
                            var input = $(this);

                            if (input.is('input[type="text"]') || input.is('textarea')) {
                                if (isReadOnly) {
                                    input.attr("readonly", true);
                                } else {
                                    input.removeAttr("readonly");
                                }

                                if (ctrlInfo.hasHintText) {
                                    input.hintText("disabled", isReadOnly);
                                }
                            } else {
                                if (isReadOnly) {
                                    input.attr("disabled", true);
                                } else {
                                    input.removeAttr("disabled");
                                }
                            }
                        });
                    }


                    if (div.hasClass("owd-entity-table-cell")) {
                        div.children("div").show();
                        div.removeClass("owd-responsive-hide");

                        var msgCell = $("#cmc-" + ctrlInfo.id.replace(".", "\\."));
                        if (msgCell.length > 0) {
                            msgCell.children("div").show();
                            msgCell.removeClass("owd-responsive-hide")
                        }
                    } else {
                        div.show();
                    }

                    div.show();
                }
            }
        };

        stateEngine.evaluate();
        $("#owdInterviewForm").append($('<input name="__DYNAMIC_CONTROL_STATE" type="hidden" value="true"/>'));

    });
}

// attachments interface
$(function() {
    $("body").on("change", "input.multi-attach", function() {
        var $this = $(this);
        var $parent = $this.parent();
        var container = $this.closest(".multi-attach-container");

        var item = $("<span>");
        var name = $this.val();
        var lastSlash = name.lastIndexOf("\\");
        if (lastSlash >= 0) {
            name = name.substring(lastSlash + 1);
        }
        item.text(name);
        item.append('&nbsp;<a class="multi-attach-remove" href="#">remove</a>');
        $parent.append(item);
        var newupload = $('<div class="multi-attach-item"><input class="multi-attach" type="file"></div>');
        $input = newupload.find("input");
        $input.attr("name", $this.attr("name"));

        $this.hide();
        container.append(newupload);
        if (unsubmittedDataWarning.isEnabled) {
        	owdMarkPageAsDirty();
        }
     });
    $("body").on("click", "a.multi-attach-remove", function (event) {
        var $this = $(this);
        var $parent = $this.closest("div");
        $parent.remove();
        event.preventDefault();
    });
    $("body").on("click", "a.multi-attach-exist-remove", function (event) {
        var $this = $(this);
        var $parent = $this.closest("div");
        var $input = $parent.find("input");
        $parent.hide();
        $input.attr("value", "1");

        if (unsubmittedDataWarning.isEnabled) {
        	owdMarkPageAsDirty();
        }

        event.preventDefault();
    });
});

//boolean attribute checkbox controls
$(function(){
    var ctrls = screenInfo.controls;
    for(var i = 0; i < ctrls.length; ++i){
        var ctrlInfo = ctrls[i];
        if(ctrlInfo.type === "BooleanInputControl" && ctrlInfo.inputType === "checkbox"){
            var checkbox = $('#' + ctrlInfo.id.replace(".", "\\."));
            checkbox.attr('name', ctrlInfo.name + "-cb");

            var val = checkbox.is(':checked') ? "true" : "false";
            checkbox.parent().append('<input type="hidden" value="' + val + '" name="' + ctrlInfo.name  + '" id="__cbHiddenInput__' + ctrlInfo.id + '">');

            checkbox.click(function(){
                var $this = $(this);
                var shadowCtrl = $('#__cbHiddenInput__' + $this.attr('id').replace(".", "\\."));
                var val = $this.is(':checked') ? "true" : "false";
                shadowCtrl.attr("value", val);
           });


        }
    }
});