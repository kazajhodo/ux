!function(e,t,i,s){"use strict";function n(i,s){this.element=i,this.$element=e(this.element),this.isSupported()?(this._name=o,this._defaults=e.fn.uxFormSelect.defaults,this.options=e.extend({},this._defaults,s),this.uniqueId=t.Ux.guid(),this.init()):this.$element.addClass("invalid")}var o="uxFormSelect";e.extend(n.prototype,{init:function(){this.buildCache(),this.buildElement(),this.bindEvents()},destroy:function(){this.unbindEvents(),this.$element.removeData()},buildCache:function(){this.$field=this.$element.find("select"),this.$wrapper=e('<div class="ux-form-select-wrapper ux-form-input"></div>'),this.$caret=e('<span class="ux-form-select-caret">&#9660;</span>'),this.$trigger=e('<input class="ux-form-input-item" readonly="true"></input>'),this.$hidden=e('<input class="ux-form-select-hidden"></input>'),this.$dropdown=e('<ul class="ux-form-select-dropdown"></ul>'),this.multiple=!!this.$field.attr("multiple"),this.placeholder=this.$field.attr("placeholder")||(this.multiple?"Select Multiple":"Select One"),this.$trigger.addClass("ux-form-select-trigger"),this.$trigger.attr("placeholder",this.placeholder),this.$wrapper.insertAfter(this.$field),this.$wrapper.append(this.$caret).append(this.$hidden).append(this.$trigger).append(this.$dropdown).append(this.$field),this.$dropdown.addClass(this.multiple?"is-multiple":"is-single")},buildElement:function(){var e=this;this.loadOptionsFromSelect(),this.updateTrigger(),t.attachBehaviors(this.$element[0]),this.options.debug&&(this.$field.show(),setTimeout(function(){e.$trigger.trigger("tap")},500)),this.$field.attr("tabindex")&&this.$trigger.attr("tabindex",this.$field.attr("tabindex")),setTimeout(function(){e.$element.addClass("ready")})},bindEvents:function(){var e=this;e.$trigger.on("tap",function(t){e.populateDropdown.call(e),e.showDropdown.call(e)}),e.$dropdown.on("tap."+e._name,".selector",function(t){e.onItemTap.call(e,t),e.$trigger.focus()}),e.$dropdown.on("tap."+e._name,".close",function(t){e.closeDropdown.call(e,t)}),e.$hidden.on("focus",function(t){e.populateDropdown.call(e),e.showDropdown.call(e),e.$trigger.focus()}),e.$element.on("focusout",function(e){})},unbindEvents:function(){this.$element.off("."+this._name),this.$dropdown.off("."+this._name),e(s).off("."+this._name)},onItemTap:function(t){var i,s=e(t.currentTarget),n=s.data("option");return this.multiple?(this.$dropdown.find(".selector.selected").removeClass("selected"),s.is(".active")?(i="remove",s.removeClass("active"),s.find("input").prop("checked",!1).trigger("change")):(i="add",s.addClass("active"),s.find("input").prop("checked",!0).trigger("change"),s.addClass("selected")),this.changeSelected(n,i)):(this.changeSelected(n,"add"),this.closeDropdown())},onSearch:function(t){var i=e(t.currentTarget),s=i.val().toLowerCase();s?this.$dropdown.find(".selector").each(function(){var t=e(this).data("option").text.toLowerCase();t.indexOf(s)>=0?e(this).show():e(this).hide()}):this.$dropdown.find(".selector").show()},populateDropdown:function(){this.$dropdown.find("li").remove(),0===this.$dropdown.children().length&&this.$dropdown.append('<li class="close">&times;</li>').append('<li class="search"><input type="text" class="ux-form-input-item simple search-input" tabindex="-1"></input></li>').find(".search-input").attr("placeholder",this.placeholder),this.$trigger.val()?this.$dropdown.find(".search-input").attr("placeholder",this.$trigger.val()):this.$dropdown.find(".search-input").attr("placeholder",this.placeholder);for(var i=this.getAllOptions(),s=0;s<i.length;s++){var n=i[s],o=e("<li></li>");n.group?(o.addClass("optgroup"),o.html("<span>"+n.text+"</span>")):this.multiple?(o.addClass("selector ux-select-checkbox ready"),o.html('<span><input type="checkbox" class="form-checkbox"><label class="option">'+n.text+"</label></span>")):(o.addClass("selector"),o.html("<span>"+n.text+"</span>")),n.selected&&(o.addClass("active"),o.find("input").prop("checked",!0)),o.data("option",n),this.$dropdown.append(o)}this.$dropdown.find(".selector.active:eq(0)").addClass("selected"),t.attachBehaviors(this.$dropdown[0])},loadOptionsFromSelect:function(){var t=this;this.selected=[],this.$field.find("option, optgroup").each(function(){var i={value:"",text:"",selected:!1,group:!1};e(this).is("optgroup")?(i.text=e(this).attr("label"),i.group=!0):(i.value=e(this).attr("value"),i.text=e(this).html(),i.selected=e(this).is(":selected")),t.selected.push(i)})},getAllOptions:function(e){if(!e)return this.selected;for(var t=[],i=0;i<this.selected.length;i++)t.push(this.selected[i][e]);return t},updateTrigger:function(){this.$trigger.val(this.htmlDecode(this.getSelectedOptions("text").join(", ")))},updateSearch:function(){this.$dropdown.find(".search-input").attr("placeholder",this.getSelectedOptions("text").join(", "))},getSelectedOptions:function(e){for(var t=[],i=0;i<this.selected.length;i++)this.selected[i].selected&&(e?t.push(this.selected[i][e]):t.push(this.selected[i]));return t},changeSelected:function(e,t){for(var i=!1,s=0;s<this.selected.length;s++)this.multiple||(this.selected[s].selected=!1),this.selected[s].value===e.value&&(i=!0,"add"===t?this.selected[s].selected=!0:"remove"===t&&(this.selected[s].selected=!1));this.updateTrigger(),this.multiple&&this.updateSearch(),this.updateSelect(i?null:e)},updateSelect:function(t){if(t){var i=e("<option></option>").attr("value",t.value).html(t.text);this.$field.append(i)}this.$field.val(this.getSelectedOptions("value")),this.$field.trigger("change",[!0]),this.$field.trigger("input",[!0])},showDropdown:function(){var t=this;return e(s).trigger("tap"),this.open?this.closeDropdown():(this.open=!0,this.$element.addClass("active"),setTimeout(function(){t.$element.addClass("animate"),t.$dropdown.focus()},50),t.$hidden.attr("readonly",!0),void this.windowHideDropdown())},windowHideDropdown:function(){var t=this;e(s).on("tap."+t.uniqueId,function(i){t.open&&(e(i.target).closest(t.$dropdown).length||t.closeDropdown())})},closeDropdown:function(){var t=this;this.open=!1,this.$dropdown.find(".search-input").val(""),this.$element.removeClass("animate"),e(s).off("."+t.uniqueId),setTimeout(function(){t.open===!1&&t.$element.removeClass("active")},350),t.$hidden.attr("readonly",!1)},isSupported:function(){return"Microsoft Internet Explorer"===i.navigator.appName?s.documentMode>=8:!(/iP(od|hone)/i.test(i.navigator.userAgent)||/IEMobile/i.test(i.navigator.userAgent)||/Windows Phone/i.test(i.navigator.userAgent)||/BlackBerry/i.test(i.navigator.userAgent)||/BB10/i.test(i.navigator.userAgent)||/Android.*Mobile/i.test(i.navigator.userAgent))},htmlDecode:function(t){return e("<div/>").html(t).text()}}),e.fn.uxFormSelect=function(t){return this.each(function(){var i=e(this);i.hasClass("browser-default")||i.find("select").hasClass("browser-default")||e.data(this,o)||e.data(this,o,new n(this,t))}),this},e.fn.uxFormSelect.defaults={debug:!1},t.behaviors.uxFormSelect={attach:function(t){var i=e(t);i.find(".ux-form-select").once("ux-form-select").uxFormSelect()},detach:function(t){e(t).find(".ux-form-select").each(function(){var t=e(this).data("uxFormSelect");t&&t.destroy()})}}}(jQuery,Drupal,window,document);