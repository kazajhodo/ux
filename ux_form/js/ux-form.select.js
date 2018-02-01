!function(e,t,i,n){"use strict";function o(i,n){this.element=i,this.$element=e(this.element),this._name=s,this._defaults=e.fn.uxFormSelect.defaults,this.options=e.extend({},this._defaults,n),this.uniqueId=t.Ux.guid(),this.init()}var s="uxFormSelect";e.extend(o.prototype,{init:function(){this.buildCache(),this.buildElement(),this.evaluateElement(),this.bindEvents()},destroy:function(){this.unbindEvents(),this.$element.removeData()},buildCache:function(){this.$field=this.$element.find("select"),this.$error=this.$element.find(".field-error"),this.$trigger=e('<input class="ux-form-input-item ux-form-input-item-js" '+(this.isDisabled()?"disabled":"")+' readonly tabindex="-1"></input>'),this.$wrapper=e('<div class="ux-form-select-wrapper ux-form-input ux-form-input-js"></div>'),this.$caret=e('<span class="ux-form-select-caret">&#9660;</span>'),this.multiple=!!this.$field.attr("multiple"),this.placeholder=this.$field.attr("placeholder")||(this.multiple?"Select Multiple":"Select One"),this.$trigger.addClass("ux-form-select-trigger"),this.$trigger.attr("placeholder",this.placeholder),this.isSupported=this.isSupported(),this.$error.length,this.isSupported?(this.$hidden=e('<input class="ux-form-select-hidden"></input>'),this.$field.attr("tabindex")&&this.$hidden.attr("tabindex",this.$field.attr("tabindex")),this.$field.attr("tabindex","-1"),this.$dropdown=e('<div class="ux-form-select-dropdown"></div>'),this.$dropdownScroll=e('<ul class="ux-form-select-scroll"></div>').appendTo(this.$dropdown),this.$wrapper.append(this.$caret).append(this.$hidden).append(this.$trigger).append(this.$dropdown),this.$dropdown.addClass(this.multiple?"is-multiple":"is-single")):this.$wrapper.append(this.$caret).append(this.$trigger);var i=e("<div></div>");this.$wrapper.appendTo(i),t.attachBehaviors(i[0]),this.$wrapper=i.contents(),this.$wrapper.insertAfter(this.$field),this.$wrapper.append(this.$field)},buildElement:function(){var e=this;e.loadOptionsFromSelect(),e.updateTrigger(),e.options.debug&&(e.$field.show(),setTimeout(function(){e.$trigger.trigger("tap")},500)),setTimeout(function(){e.$element.addClass("ready")})},evaluateElement:function(){var e=this;e.isRequired()&&(e.$field.removeAttr("required"),e.$trigger.attr("required","required"))},bindEvents:function(){var t=this;t.$trigger.on("focus."+t._name,function(t){e(this).blur()}).on("tap."+t._name,function(e){t.isSupported?(t.populateDropdown.call(t),t.showDropdown.call(t)):(e.preventDefault(),t.$field.show().focus().hide())}),t.$field.on("state:disabled."+t._name,function(e){t.evaluateElement()}).on("state:required."+t._name,function(e){t.evaluateElement()}).on("state:visible."+t._name,function(e){t.evaluateElement()}).on("state:collapsed."+t._name,function(e){t.evaluateElement()}),t.isSupported?(t.$dropdown.on("tap."+t._name,".selector",function(e){t.onItemTap.call(t,e)}),t.$dropdown.on("tap."+t._name,".close",function(e){t.closeDropdown.call(t)}),t.$hidden.on("focusin."+t._name,function(e){t.$wrapper.addClass("focus"),e.relatedTarget&&!t.$dropdown.find(e.relatedTarget).length&&(t.populateDropdown.call(t),t.showDropdown.call(t))}).on("blur."+t._name,function(e){t.$wrapper.removeClass("focus")}).on("keydown."+t._name,function(e){t.onHiddenKeydown.call(t,e)}),t.$field.on("change."+t._name,function(e){t.loadOptionsFromSelect(),t.updateTrigger()}),t.$field.attr("autofocus")&&(t.populateDropdown.call(t),t.showDropdown.call(t))):t.$field.on("change."+t._name,function(e){t.loadOptionsFromSelect(),t.updateTrigger()})},unbindEvents:function(){this.$element.off("."+this._name),this.$dropdown.off("."+this._name),this.$dropdown.find(".search-input").off("."+this._name),this.$field.off("."+this._name),e("body").off("."+this._name)},onItemTap:function(t){var i,n=e(t.currentTarget),o=n.data("option");return this.multiple?(this.$dropdown.find(".selector.selected").removeClass("selected"),n.is(".active")?(i="remove",n.removeClass("active"),n.find("input").prop("checked",!1).trigger("change")):(i="add",n.addClass("active selected"),n.find("input").prop("checked",!0).trigger("change")),this.changeSelected(o,i)):(this.changeSelected(o,"add"),this.closeDropdown(!0))},onHiddenKeydown:function(e){if(!this.open){if(9===e.which)return;if(38===e.which||40===e.which)return this.showDropdown();if(13===e.which)return;if(39===e.which||37===e.which)return void e.preventDefault();if(-1===[9,13,27,37,38,39,40].indexOf(e.which)){e.preventDefault(),this.showDropdown();var t=e.which||e.keyCode,i=String.fromCharCode(t).toLowerCase();this.$dropdown.find(".search-input").val(i),this.onSearchKeyup(e)}}},onSearchKeydown:function(e){var t;if(9===e.which){if(t=this.$dropdown.find(".selector.selected"),t.length){var i=t.data("option");this.changeSelected(i,"add")}var n=this.$element.closest("form").find(":input:visible").not(".ignore"),o=n.eq(n.index(e.target)+1);return o.length&&(o.focus(),e.preventDefault()),this.closeDropdown()}if(27===e.which)return this.closeDropdown(!0);13===e.which&&(t=this.$dropdown.find(".selector.selected"),t.length&&t.trigger("tap"),e.preventDefault()),40!==e.which&&39!==e.which||(this.highlightOption(this.$dropdown.find(".selector.selected").nextAll(".selector:visible").first()),e.preventDefault()),38!==e.which&&37!==e.which||(this.highlightOption(this.$dropdown.find(".selector.selected").prevAll(".selector:visible").first()),e.preventDefault())},onSearchKeyup:function(t){if(-1===[9,13,27,37,38,39,40].indexOf(t.which)){var i=e(t.currentTarget),n=i.val().toLowerCase();if(n){var o=this.$dropdown.find(".selector");this.multiple&&(o=o.filter(":not(.active)")),o.each(function(){e(this).data("option").text.toLowerCase().indexOf(n)>=0?e(this).removeClass("hide"):e(this).addClass("hide")})}else this.$dropdown.find(".selector").removeClass("hide");this.highlightOption(this.$dropdown.find(".selector:visible").first())}t.preventDefault()},highlightOption:function(e,t){!1!==t&&(t=!0),e=e||this.$dropdownScroll.find(".selector.active:eq(0)"),e.length&&(this.$dropdown.find(".selector.selected").removeClass("selected"),e.addClass("selected"),t&&this.highlightScrollTo(e))},highlightScrollTo:function(e){if(e=e||this.$dropdown.find(".selector.selected"),e.length){var t=this.$dropdownScroll.scrollTop(),i=this.$dropdownScroll.outerHeight(),n=this.$dropdownScroll.offset().top,o=e.offset().top,s=e.outerHeight(),r=t+o-n;r+s>i+t?this.$dropdownScroll.scrollTop(r+s-i):r<t&&this.$dropdownScroll.scrollTop(r)}},populateDropdown:function(){var i=this;this.$dropdownScroll.find("li").remove(),0===this.$dropdown.find(".search-input").length&&this.$dropdown.prepend('<div class="close">&times;</div>').prepend('<div class="search"><input type="text" class="ux-form-input-item simple search-input"></input></div>').find(".search-input").attr("placeholder",this.placeholder).on("keydown."+this._name,function(e){i.onSearchKeydown.call(i,e)}).on("keyup."+this._name,function(e){i.onSearchKeyup.call(i,e)}),this.$trigger.val()?this.$dropdown.find(".search-input").attr("placeholder",this.$trigger.val()):this.$dropdown.find(".search-input").attr("placeholder",this.placeholder);for(var n=this.getAllOptions(),o=0;o<n.length;o++){var s=n[o],r=e("<li></li>");s.group?(r.addClass("optgroup"),r.html("<span>"+s.text+"</span>")):this.multiple?(r.addClass("selector ux-form-checkbox ready"),r.html('<span><input type="checkbox" class="form-checkbox ignore" data-ux-auto-submit-exclude><label class="option">'+s.text+'<div class="ux-ripple"></div></label></span>')):(r.addClass("selector"),r.html("<span>"+s.text+"</span>")),s.selected&&(r.addClass("active"),r.find("input").prop("checked",!0)),r.data("option",s),this.$dropdownScroll.append(r)}this.multiple&&this.$dropdownScroll.find(".form-checkbox").on("change",function(){i.highlightOption(e(this).closest(".selector"),!1),i.$dropdown.find(".search-input").focus()}),this.highlightOption(),t.attachBehaviors(this.$dropdownScroll[0])},loadOptionsFromSelect:function(){var t=this;this.selected=[],this.$field.find("option, optgroup").each(function(){var i={value:"",text:"",selected:!1,group:!1};e(this).is("optgroup")?(i.text=e(this).attr("label"),i.group=!0):(i.value=e(this).attr("value"),i.text=e(this).html(),i.selected=e(this).is(":selected")),t.selected.push(i)})},getAllOptions:function(e){if(!e)return this.selected;for(var t=[],i=0;i<this.selected.length;i++)t.push(this.selected[i][e]);return t},updateTrigger:function(){var e=this.getSelectedOptions("value").join("");null===e||""===e||"_none"===e?(this.$trigger.val(""),this.$trigger.attr("placeholder",this.htmlDecode(this.getSelectedOptions("text").join(", ")))):this.$trigger.val(this.htmlDecode(this.getSelectedOptions("text").join(", "))).trigger("change")},updateSearch:function(){this.$dropdown.find(".search-input").attr("placeholder",this.getSelectedOptions("text").join(", "))},getSelectedOptions:function(e){for(var t=[],i=0;i<this.selected.length;i++)this.selected[i].selected&&(e?t.push(this.selected[i][e]):t.push(this.selected[i]));return t},changeSelected:function(e,t){for(var i=!1,n=0;n<this.selected.length;n++)this.multiple||(this.selected[n].selected=!1),this.selected[n].value===e.value&&(i=!0,"add"===t?this.selected[n].selected=!0:"remove"===t&&(this.selected[n].selected=!1));this.updateTrigger(),this.multiple&&this.updateSearch(),this.updateSelect(i?null:e)},updateSelect:function(t){if(t){var i=e("<option></option>").attr("value",t.value).html(t.text);this.$field.append(i)}this.$field.val(this.getSelectedOptions("value")),this.$field.trigger("change",[!0]),this.$field.trigger("input",[!0])},showDropdown:function(){var t=this;if(e("body").trigger("tap"),this.open)return this.closeDropdown();this.open=!0,this.$element.addClass("active"),this.highlightScrollTo(),setTimeout(function(){t.$element.addClass("animate"),t.$dropdown.find(".search-input").focus()},50),this.windowHideDropdown()},windowHideDropdown:function(){var t=this;e("body").on("tap."+t.uniqueId,function(i){t.open&&(e(i.target).closest(t.$dropdown).length||t.closeDropdown())})},closeDropdown:function(t){var i=this;this.open=!1,this.$dropdown.find(".search-input").val(""),this.$dropdownScroll.find(".hide").removeClass("hide"),this.$element.removeClass("animate"),e("body").off("."+i.uniqueId),setTimeout(function(){!1===i.open&&i.$element.removeClass("active")},350),t&&setTimeout(function(){i.$hidden.trigger("focus",[1])})},isRequired:function(){return void 0!==this.$field.attr("required")},isDisabled:function(){return this.$field.is(":disabled")},isSupported:function(){return this.isIE()?n.documentMode>=8:!(/iP(od|hone)/i.test(i.navigator.userAgent)||/IEMobile/i.test(i.navigator.userAgent)||/Windows Phone/i.test(i.navigator.userAgent)||/BlackBerry/i.test(i.navigator.userAgent)||/BB10/i.test(i.navigator.userAgent)||/Android.*Mobile/i.test(i.navigator.userAgent))},isIE:function(){return i.navigator&&i.navigator.appName&&"Microsoft Internet Explorer"===i.navigator.appName},htmlDecode:function(t){return e("<div/>").html(t).text()}}),e.fn.uxFormSelect=function(t){return this.each(function(){var i=e(this);i.hasClass("browser-default")||i.find("select").hasClass("browser-default")||e.data(this,s)||e.data(this,s,new o(this,t))}),this},e.fn.uxFormSelect.defaults={debug:!1},t.behaviors.uxFormSelect={attach:function(t){e(t).find(".ux-form-select").once("ux-form-select").uxFormSelect()}}}(jQuery,Drupal,window,document);