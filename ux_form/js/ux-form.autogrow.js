!function(t,i){"use strict";i.behaviors.uxFormAutogrow={attach:function(i,e){t.each(t("textarea[data-autogrow]",i).once(),function(){var i=t(this),e=this.offsetHeight-this.clientHeight,o=function(i){var o=t(i),a=o.data("autogrow-max"),n=i.scrollHeight+e;a&&n>a?o.css({overflow:"auto",resize:"vertical"}):o.css({minHeight:"auto",overflow:"hidden",resize:"none"}).css("minHeight",i.scrollHeight+e)};o(this),i.on("keyup input",function(){o(this)})})}}}(jQuery,Drupal);