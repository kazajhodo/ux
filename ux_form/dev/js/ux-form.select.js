
(function ($, Drupal, window, document) {

  'use strict';

  var pluginName = 'uxFormSelect';

  function Plugin(element, options) {
    this.element = element;
    this.$element = $(this.element);
    this._name = pluginName;
    this._defaults = $.fn.uxFormSelect.defaults;
    this.options = $.extend({}, this._defaults, options);
    this.uniqueId = Drupal.Ux.guid();
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {

    /*
    Initialize plugin instance.
     */
    init: function () {
      this.buildCache();
      this.buildElement();
      this.evaluateElement();
      this.bindEvents();
    },

    /*
    Remove plugin instance complete.
     */
    destroy: function () {
      this.unbindEvents();
      this.$element.removeData();
    },

    /*
    Cache DOM nodes for performance.
     */
    buildCache: function () {
      this.$field = this.$element.find('select').attr('tabindex', '-1');
      this.$trigger = $('<input class="ux-form-input-item ux-form-input-item-js" ' + (this.isDisabled() ? 'disabled' : '') + ' readonly tabindex="-1"></input>');
      this.$wrapper = $('<div class="ux-form-select-wrapper ux-form-input ux-form-input-js"></div>');
      this.$caret = $('<span class="ux-form-select-caret">&#9660;</span>');
      this.multiple = (this.$field.attr('multiple')) ? true : false;
      this.placeholder = this.$field.attr('placeholder') || (this.multiple ? 'Select Multiple' : 'Select One');
      this.$trigger.addClass('ux-form-select-trigger');
      this.$trigger.attr('placeholder', this.placeholder);
      this.$wrapper.insertAfter(this.$field);
      this.isSupported = this.isSupported();

      if (this.isSupported) {
        this.$hidden = $('<input class="ux-form-select-hidden"></input>');
        this.$dropdown = $('<ul class="ux-form-select-dropdown"></ul>');
        // this.$wrapper.append(this.$caret).append(this.$trigger).append(this.$dropdown).append(this.$field);
        this.$wrapper.append(this.$caret).append(this.$hidden).append(this.$trigger).append(this.$dropdown).append(this.$field);
        this.$dropdown.addClass((this.multiple ? 'is-multiple' : 'is-single'));
      }
      else {
        this.$wrapper.append(this.$caret).append(this.$trigger).append(this.$field);
      }
    },

    /*
    Process fields.
     */
    buildElement: function () {
      var _this = this;
      _this.loadOptionsFromSelect();
      _this.updateTrigger();
      Drupal.attachBehaviors(_this.$element[0]);

      if (_this.options.debug) {
        _this.$field.show();
        setTimeout(function () {
          _this.$trigger.trigger('tap');
        }, 500);
      }

      // Copy tabindex
      if (this.isSupported) {
        // if (_this.$field.attr('tabindex')) {
        //   _this.$trigger.attr('tabindex', _this.$field.attr('tabindex'));
        // }
      }

      setTimeout(function () {
        _this.$element.addClass('ready');
      });
    },

    /*
    Evaluate element. Runs on init and state changes.
     */
    evaluateElement: function () {
      var _this = this;

      // Check if field is required.
      if (_this.isRequired()) {
        _this.$field.removeAttr('required');
        _this.$trigger.attr('required', 'required');
      }
    },

    /*
    Bind events that trigger methods.
    */
    bindEvents: function () {
      var _this = this;

      _this.$trigger.on('focus' + '.' + _this._name, function (e) {
        // We blur as soon as the focus happens to avoid the cursor showing
        // momentarily within the field.
        $(this).blur();
      })
      .on('tap' + '.' + _this._name, function (e) {
        if (_this.isSupported) {
          _this.populateDropdown.call(_this);
          _this.showDropdown.call(_this);
        }
        else {
          e.preventDefault();
          _this.$field.show().focus().hide();
        }
      });

      _this.$field.on('state:disabled' + '.' + _this._name, function (e) {
        _this.evaluateElement();
      }).on('state:required' + '.' + _this._name, function (e) {
        _this.evaluateElement();
      }).on('state:visible' + '.' + _this._name, function (e) {
        _this.evaluateElement();
      }).on('state:collapsed' + '.' + _this._name, function (e) {
        _this.evaluateElement();
      });

      if (_this.isSupported) {
        _this.$dropdown.on('tap' + '.' + _this._name, '.selector', function (e) {
          _this.onItemTap.call(_this, e);
        });
        _this.$dropdown.on('tap' + '.' + _this._name, '.close', function (e) {
          _this.closeDropdown.call(_this);
        });
        _this.$hidden.on('focus' + '.' + _this._name, function (e) {
          _this.$wrapper.addClass('focus');
          // Don't trigger dropdown when moving from the .search-input field.
          if (e.relatedTarget && !$(e.relatedTarget).hasClass('search-input')) {
            _this.populateDropdown.call(_this);
            _this.showDropdown.call(_this);
          }
        }).on('blur' + '.' + _this._name, function (e) {
          _this.$wrapper.removeClass('focus');
        }).on('keydown' + '.' + _this._name, function (e) {
          _this.onHiddenKeydown.call(_this, e);
        });
      }
      else {
        // On unsupported devies we rely on the device select widget and need
        // to update the trigger upon change.
        this.$field.on('change' + '.' + _this._name, function (e) {
          _this.loadOptionsFromSelect();
          _this.updateTrigger();
        });
      }
    },

    /*
    Unbind events that trigger methods.
    */
    unbindEvents: function () {
      this.$element.off('.' + this._name);
      this.$dropdown.off('.' + this._name);
      this.$dropdown.find('.search-input').off('.' + this._name);
      this.$field.off('.' + this._name);
      $(document).off('.' + this._name);
    },

    /*
    Click event of inidividual dropdown item.
     */
    onItemTap: function (e) {
      var $item = $(e.currentTarget);
      var option = $item.data('option');
      var action;

      if (!this.multiple) {
        this.changeSelected(option, 'add');
        return this.closeDropdown(true);
      }

      this.$dropdown.find('.selector.selected').removeClass('selected');
      if ($item.is('.active')) {
        action = 'remove';
        $item.removeClass('active');
        $item.find('input').prop('checked', false).trigger('change');
      }
      else {
        action = 'add';
        $item.addClass('active selected');
        $item.find('input').prop('checked', true).trigger('change');
      }
      return this.changeSelected(option, action);
    },

    /*
    Click event of inidividual dropdown item.
     */
    onHiddenKeydown: function (e) {

      if (!this.open) {
        // TAB - switch to another input.
        if (e.which === 9) {
          // alert('hit');
          // return;
        }

        // ARROW DOWN WHEN SELECT IS CLOSED - open dropdown.
        if ((e.which === 38 || e.which === 40)) {
          return this.showDropdown();
        }

        // ENTER WHEN SELECT IS CLOSED - submit form.
        if (e.which === 13) {
          return;
        }

        if (e.which === 39 || e.which === 37) {
          e.preventDefault();
        }
      }
    },

    /*
    Click event of inidividual dropdown item.
     */
    onSearchKeydown: function (e) {
      var _this = this;
      var $item;

      // TAB - switch to another input.
      if (e.which === 9) {
        return this.closeDropdown();
      }

      // ESC - close dropdown.
      if (e.which === 27) {
        return this.closeDropdown(true);
      }

      // ENTER - select option and close when select this.$options are opened
      if (e.which === 13) {
        $item = this.$dropdown.find('.selector.selected');
        if ($item.length) {
          $item.trigger('tap');
        }
      }

      // ARROW DOWN or RIGHT - move to next not disabled option
      if (e.which === 40 || e.which === 39) {
        _this.highlightOption(this.$dropdown.find('.selector.selected').nextAll('.selector').first());
      }

      // ARROW UP or LEFT - move to next not disabled option
      if (e.which === 38 || e.which === 37) {
        _this.highlightOption(this.$dropdown.find('.selector.selected').prevAll('.selector').first());
      }

      // When user types letters.
      var letter = String.fromCharCode(e.which).toLowerCase();
      var nonLetters = [9, 13, 27, 37, 38, 39, 40];
      if (letter && (nonLetters.indexOf(e.which) === -1)) {
        $item = $(e.currentTarget);
        var search = $item.val().toLowerCase();
        // Backspace
        if (e.which === 8) {
          search = search.substring(0, search.length - 1);
        }
        else {
          // we may have issues with strange characters.
          search += letter;
        }
        if (search) {
          this.$dropdown.find('.selector').each(function () {
            var text = $(this).data('option').text.toLowerCase();
            if (text.indexOf(search) >= 0) {
              $(this).show();
            }
            else {
              $(this).hide();
            }
          });
        }
        else {
          _this.$dropdown.find('.selector').show();
        }
        _this.highlightOption(this.$dropdown.find('.selector:visible').first());
      }
      else {
        e.preventDefault();
      }
    },

    /*
    Highlight an option.
     */
    highlightOption: function ($item) {
      if ($item.length) {
        this.$dropdown.find('.selector.selected').removeClass('selected');
        $item.addClass('selected');
      }
    },

    /*
    Reset and repopulate all dropdown options.
     */
    populateDropdown: function () {
      var _this = this;
      this.$dropdown.find('li').remove();

      if (this.$dropdown.children().length === 0) {
        this.$dropdown
          .append('<li class="close">&times;</li>')
          .append('<li class="search"><input type="text" class="ux-form-input-item simple search-input" tabindex="-1"></input></li>')
          .find('.search-input').attr('placeholder', this.placeholder).on('keydown' + '.' + this._name, function (e) {
            _this.onSearchKeydown.call(_this, e);
          });
      }
      if (this.$trigger.val()) {
        this.$dropdown.find('.search-input').attr('placeholder', this.$trigger.val());
      }
      else {
        this.$dropdown.find('.search-input').attr('placeholder', this.placeholder);
      }
      var options = this.getAllOptions();
      for (var i = 0; i < options.length; i++) {
        var option = options[i];

        var li = $('<li></li>');

        if (option.group) {
          li.addClass('optgroup');
          li.html('<span>' + option.text + '</span>');
        }
        else if (this.multiple) {
          li.addClass('selector ux-select-checkbox ready');
          li.html('<span><input type="checkbox" class="form-checkbox"><label class="option">' + option.text + '</label></span>');
        }
        else {
          li.addClass('selector');
          li.html('<span>' + option.text + '</span>');
        }

        if (option.selected) {
          li.addClass('active');
          li.find('input').prop('checked', true);
        }

        li.data('option', option);
        this.$dropdown.append(li);
      }

      this.$dropdown.find('.selector.active:eq(0)').addClass('selected');
      Drupal.attachBehaviors(this.$dropdown[0]);
    },

    /*
    Store all items of a select.
     */
    loadOptionsFromSelect: function () {
      var _this = this;
      this.selected = [];
      this.$field.find('option, optgroup').each(function () {
        var values = {
          value: '',
          text: '',
          selected: false,
          group: false
        };
        if ($(this).is('optgroup')) {
          values.text = $(this).attr('label');
          values.group = true;
        }
        else {
          values.value = $(this).attr('value');
          values.text = $(this).html();
          values.selected = $(this).is(':selected');
        }
        _this.selected.push(values);
      });
    },

    getAllOptions: function (field) {
      if (!field) {
        return this.selected;
      }
      var vals = [];
      for (var i = 0; i < this.selected.length; i++) {
        vals.push(this.selected[i][field]);
      }
      return vals;
    },

    updateTrigger: function () {
      var value = this.getSelectedOptions('value').join('');
      if (value === null || value === '' || value === '_none') {
        this.$trigger.val('');
        this.$trigger.attr('placeholder', this.htmlDecode(this.getSelectedOptions('text').join(', ')));
      }
      else {
        this.$trigger.val(this.htmlDecode(this.getSelectedOptions('text').join(', '))).trigger('change');
      }
    },

    updateSearch: function () {
      this.$dropdown.find('.search-input').attr('placeholder', this.getSelectedOptions('text').join(', '));
    },

    getSelectedOptions: function (field) {
      var vals = [];
      for (var i = 0; i < this.selected.length; i++) {
        if (this.selected[i].selected) {
          if (field) {
            vals.push(this.selected[i][field]);
          }
          else {
            vals.push(this.selected[i]);
          }
        }
      }
      return vals;
    },

    changeSelected: function (option, action) {
      var found = false;
      for (var i = 0; i < this.selected.length; i++) {
        if (!this.multiple) {
          this.selected[i].selected = false;
        }
        if (this.selected[i].value === option.value) {
          found = true;
          if (action === 'add') {
            this.selected[i].selected = true;
          }
          else if (action === 'remove') {
            this.selected[i].selected = false;
          }
        }
      }

      this.updateTrigger();
      if (this.multiple) {
        this.updateSearch();
      }
      this.updateSelect((!found) ? option : null);
    },

    updateSelect: function (newOption) {
      if (newOption) {
        var option = $('<option></option>')
          .attr('value', newOption.value)
          .html(newOption.text);
        this.$field.append(option);
      }

      this.$field.val(this.getSelectedOptions('value'));
      this.$field.trigger('change', [true]);
      this.$field.trigger('input', [true]);
    },

    showDropdown: function () {
      var _this = this;
      $(document).trigger('tap');
      if (this.open) {
        return this.closeDropdown();
      }
      this.open = true;

      this.$element.addClass('active');
      setTimeout(function () {
        _this.$element.addClass('animate');
        _this.$dropdown.find('.search-input').focus();
      }, 50);
      this.windowHideDropdown();
    },

    windowHideDropdown: function () {
      var _this = this;
      $(document).on('tap' + '.' + _this.uniqueId, function (e) {
        if (!_this.open) {
          return;
        }
        if ($(e.target).closest(_this.$dropdown).length) {
          return;
        }
        _this.closeDropdown();
      });
    },

    closeDropdown: function (focus) {
      var _this = this;
      this.open = false;
      this.$dropdown.find('.search-input').val('');
      this.$element.removeClass('animate');
      $(document).off('.' + _this.uniqueId);
      setTimeout(function () {
        if (_this.open === false) {
          _this.$element.removeClass('active');
          // _this.$hidden.focus();
        }
      }, 350);
      if (focus) {
        setTimeout(function () {
          _this.$hidden.trigger('focus', [1]);
        });
      }
      // _this.$trigger.blur();
    },

    /*
    Check if element is required.
     */
    isRequired: function () {
      var required = this.$field.attr('required');
      return typeof required !== 'undefined';
    },

    /*
    Check if element is disabled.
     */
    isDisabled: function () {
      return this.$field.is(':disabled');
    },

    /*
    Check if device is supported.
     */
    isSupported: function () {
      if (window.navigator.appName === 'Microsoft Internet Explorer') {
        return document.documentMode >= 8;
      }
      if (/iP(od|hone)/i.test(window.navigator.userAgent) || /IEMobile/i.test(window.navigator.userAgent) || /Windows Phone/i.test(window.navigator.userAgent) || /BlackBerry/i.test(window.navigator.userAgent) || /BB10/i.test(window.navigator.userAgent) || /Android.*Mobile/i.test(window.navigator.userAgent)) {
        return false;
      }
      return true;
    },

    htmlDecode: function (value) {
      return $('<div/>').html(value).text();
    }

  });

  $.fn.uxFormSelect = function (options) {
    this.each(function () {
      var $element = $(this);
      if ($element.hasClass('browser-default') || $element.find('select').hasClass('browser-default')) {
        return; // Continue to next (return false breaks out of entire loop)
      }
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new Plugin(this, options));
      }
    });
    return this;
  };

  $.fn.uxFormSelect.defaults = {
    debug: false
  };

  Drupal.behaviors.uxFormSelect = {
    attach: function (context) {
      var $context = $(context);
      $context.find('.ux-form-select').once('ux-form-select').uxFormSelect();
    },
    detach: function (context, setting, trigger) {
      if (trigger === 'unload') {
        $(context).find('.ux-form-select').each(function () {
          var plugin = $(this).data('uxFormSelect');
          if (plugin) {
            plugin.destroy();
          }
        });
      }
    }
  };

})(jQuery, Drupal, window, document);
