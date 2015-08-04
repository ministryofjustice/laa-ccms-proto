jQuery(function () { document.documentElement.focus(); });

function htmlDecode(encodedhtml) {
    return $("<div/>").html(encodedhtml).text();
}

function htmlEncode(rawText) {
    return $("<div/>").text(rawText).html();
}

jQuery(function () {
    if (fadeAnimation.fadeInDuration > 0) {
        jQuery("#investigation").hide();
        jQuery("#investigation").fadeIn(fadeAnimation.fadeInDuration);
    }

    if (fadeAnimation.fadeOutDuration > 0) {
        jQuery("button[type=submit]").click(function () {
            jQuery(this).attr("clicked", true);
        });

        var doingActualSubmit = false;
        var buttonClicked;


        jQuery("#owdInterviewForm").submit(function () {
            if (!doingActualSubmit) {
                buttonClicked = jQuery("button[type=submit][clicked=true]")[0];

                if (buttonClicked != null && buttonClicked != undefined) {
                    jQuery("#wrapper").fadeOut(fadeAnimation.fadeOutDuration, actualSubmit);
                }

                return false;
            }
        });
        function actualSubmit() {
            doingActualSubmit = true;
            buttonClicked.click();
        }
    }

});

//show/hide for error messages in debugger
jQuery(function() {
    jQuery("div[id^='stack-trace-']").hide();

    jQuery("div[id^='show-hide-']").click(function(event) {
        var id = parseInt(this.id.replace("show-hide-", ""));
        jQuery("div[id='stack-trace-" + id +"']").slideToggle();
    });

});

