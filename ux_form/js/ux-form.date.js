!function(t,a,r,e){"use strict";a.behaviors.uxFormDate={attach:function(a){var r=this,e=t(a);e.find(".ux-form-date input.form-date").once("ux-form-date").each(function(){var a=t(this);a.on("focus.ux-form-date",function(a){t(this).blur()});var e={},n=a.data("drupalDateFormat");e.format="mmmm d, yyyy",e.formatSubmit=r.formatDateAsString(n),a.attr("min")&&(e.min=r.formatDateAsArray(a.attr("min"))),a.attr("max")&&(e.max=r.formatDateAsArray(a.attr("max"))),e.container="#ux-content",a.data("value",a.val()),a.pickadate(e)})},formatDateAsString:function(t){return t.replace("Y","yyyy").replace("m","mm").replace("d","dd")},formatDateAsArray:function(t){return t.split("-")},detach:function(a,r,e){"unload"===e&&t(a).find(".ux-form-date input.form-date").each(function(){var a=t(this);a.off(".ux-form-date");var r=a.pickadate("picker");"object"==typeof r&&(r.$node.val(t(r._hidden).val()),r.stop())})}}}(jQuery,Drupal,window,document);