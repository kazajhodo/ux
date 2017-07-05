!function(e,t,i,n){"use strict";function o(t,i){this.element=t,this._name=s,this._defaults=e.fn.uxFormRadio.defaults,this.options=e.extend({},this._defaults,i),this.init()}var s="uxFormRadio";e.extend(o.prototype,{init:function(){this.buildCache(),this.bindEvents(),this.buildElement()},destroy:function(){this.unbindEvents(),this.$element.removeData()},buildElement:function(){var e=this;this.$field.is(":checked")&&this.$element.addClass("active"),setTimeout(function(){e.$element.addClass("ready")})},buildCache:function(){this.$element=e(this.element),this.$field=this.$element.find("input")},bindEvents:function(){var e=this;e.$field.on("change."+e._name,function(){e.onChange.call(e)}).on("focus."+e._name,function(){e.$element.addClass("focused")}).on("blur."+e._name,function(){e.$element.removeClass("focused")})},unbindEvents:function(){this.$field.off("."+this._name)},onChange:function(){this.$element.closest(".ux-form-radios, .form-wrapper").find(".ux-form-radio.active").removeClass("active"),this.$field.is(":checked")&&this.$element.addClass("active")}}),e.fn.uxFormRadio=function(t){return this.each(function(){e.data(this,s)||e.data(this,s,new o(this,t))}),this},e.fn.uxFormRadio.defaults={},t.behaviors.uxFormRadio={attach:function(t){var i=e(t);i.find(".ux-form-radio").once("ux-form-radio").uxFormRadio()},detach:function(t,i,n){"unload"===n&&e(t).find(".ux-form-radio").each(function(){var t=e(this).data("uxFormRadio");t&&t.destroy()})}}}(jQuery,Drupal,window,document);