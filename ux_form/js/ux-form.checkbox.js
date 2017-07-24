!function(e,t,i,n){"use strict";function s(t,i){this.element=t,this._name=a,this._defaults=e.fn.uxFormCheckbox.defaults,this.options=e.extend({},this._defaults,i),this.init()}var a="uxFormCheckbox";e.extend(s.prototype,{init:function(){this.buildCache(),this.bindEvents(),this.buildElement()},destroy:function(){this.unbindEvents(),this.$element.removeData()},buildElement:function(){var e=this;if(this.$element.hasClass("form-no-label")){var t=this.$element.find("label");t.removeClass("visually-hidden"),t.html('<span class="visually-hidden">'+t.html()+"</span>")}this.$field.is(":checked")&&this.$element.addClass("active"),setTimeout(function(){e.$element.addClass("ready")})},buildCache:function(){this.$element=e(this.element),this.$field=this.$element.find("input.form-checkbox")},bindEvents:function(){var e=this;e.$field.on("change."+e._name,function(){e.onChange.call(e),e.validate()}).on("focus."+e._name,function(){e.$element.addClass("focused"),e.validate()}).on("blur."+e._name,function(){e.$element.removeClass("focused")})},unbindEvents:function(){this.$field.off("."+this._name)},onChange:function(){this.$field.is(":checked")?this.$element.addClass("active"):this.$element.removeClass("active")},validate:function(){this.$element.removeClass("valid invalid").removeAttr("data-error"),this.isValid()||this.$element.addClass("invalid").attr("data-error",this.$field[0].validationMessage)},isValid:function(){return!0===this.$field[0].validity.valid}}),e.fn.uxFormCheckbox=function(t){return this.each(function(){e.data(this,a)||e.data(this,a,new s(this,t))}),this},e.fn.uxFormCheckbox.defaults={},t.behaviors.uxFormCheckbox={attach:function(t){e(t).find(".ux-form-checkbox").once("ux-form-checkbox").uxFormCheckbox()},detach:function(t,i,n){"unload"===n&&e(t).find(".ux-form-checkbox").each(function(){var t=e(this).data("uxFormCheckbox");t&&t.destroy()})}}}(jQuery,Drupal,window,document);