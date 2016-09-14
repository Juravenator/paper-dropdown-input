Polymer({
  is: 'paper-dropdown-input',

  behaviors: [
    Polymer.IronFormElementBehavior,
    Polymer.PaperInputBehavior,
    Polymer.Templatizer,
    Polymer.NeonAnimationRunnerBehavior
  ],

  properties: {
    /**
     * The items to show as suggestions.
     * This is either an array of strings or an array of objects, every object must contain at least the value property.
     */
    items: {
      type: Array,
      value: []
    },
    /**
     * The items remaining after filtering
     */
    _filtereditems: {
      type: Array,
      computed: '_filterItems(items, immediateValue)',
      observer: '_updateTemplate'
    },

    /**
     * The value currently in the native input element
     */
    _inputvalue: {
      type: String,
      value: "",
      observer: "_inputvalueChanged"
    },
    /**
     * The immediate value of the input.
     * This value is updated while the user is typing.
     */
    immediateValue: {
      type: String,
      value: "",
      readOnly: true,
      notify: true
    },
    /**
     * The string that represents the current value.
     */
    value: {
      type: String,
      value: "",
      // notify is already fired (twice) by Polymer.IronFormElementBehavior and Polymer.PaperInputBehavior
      // notify: true,
      observer: "_valueChanged"
    },

    /**
     * The stamped instance of your custom template, if present
     */
    _templateInstance: Object,

    /**
     * True if the input is currently active and the dropdown menu is opened
     */
    opened: {
      type: Boolean,
      observer: "_openedChanged"
    },

    /**
     * if true, this input doesn't allow any value that does not exist in the 'items' array
     */
    noFreedom: {
      type: Boolean,
      value: false
    },

    animationConfig: {
      type: Object,
      value: function() {
        return {
          'showmenu': [{
            name: 'fade-in-animation',
            node: this.$.menu,
            timing: {
              delay: 150,
              duration: 50
            }
          }, {
            name: 'expand-animation',
            node: this.$.menu,
            timing: {
              delay: 150,
              duration: 200
            }
          }],
          'hidemenu': [{
            name: 'fade-out-animation',
            node: this.$.menu,
            timing: {
              duration: 200
            }
          }]
        }
      }
    }
  },

  listeners: {
    'neon-animation-finish': '_onNeonAnimationFinish'
  },

  /**
   * Returns a filtered version of items, based on if the array object matched 'immediateValue'
   *
   * @param {Array.<Object>} items the array of items to filter
   * @param {String} immediateValue value to filter with
   * @return {Array.<Object>} the filtered array
   */
  _filterItems: function(items, immediateValue) {
    var result = [];
    for (var i = 0; i < items.length; i++) {
      var include = false;
      if (items[i].value) {
        include = items[i].value.toLowerCase().indexOf(immediateValue) > -1;
      } else if (typeof items[i] === 'string' || items[i] instanceof String) {
        include = items[i].toLowerCase().indexOf(immediateValue) > -1;
      } else {
        console.error("paper-dropdown-input: item in `items`:", items[i], " is not a string or does not contain `value` property")
      }
      if (include) {
        result.push(items[i]);
      }
    }
    return result;
  },

  /**
   * Fired when user clicks inside the dropdown menu.
   *
   * @param {Event} event the click event
   */
  _onClick: function(event) {
    var selectedItem = Polymer.dom(event).localTarget;
    if (selectedItem) {
      this._inputvalue = selectedItem.value || selectedItem.label || selectedItem.textContent.trim();
    }
  },

  /**
   * Sets up the template
   */
  ready: function() {
    var template = Polymer.dom(this).querySelector('template');
    if (!template) {
      template = this.$.menuTemplate;
    }
    this.templatize(template);
    this._templateInstance = this.stamp({
      items: this._filtereditems
    });
    Polymer.dom(this).appendChild(this._templateInstance.root);
    // instance.myProp = 'new value';
  },
  /**
   * Updates the stamped template's data
   *
   * @param {Array.<Object>} filtereditems the new list to display in the dropdown
   */
  _updateTemplate: function(filtereditems) {
    if (this._templateInstance) {
      this._templateInstance.items = filtereditems;
    }
  },

  _openedChanged: function(opened) {
    if (this.opened) {
      this.$.menu.style.display = "block";
      this.playAnimation('showmenu')
    } else {
      this.playAnimation('hidemenu')
    }
  },

  /**
   * Clears the current input
   */
  clear: function() {
    this._inputvalue= "";
  },

  _getIcon: function(immediateValue) {
    if (immediateValue && immediateValue != "") {
      return "close"
    } else {
      return "arrow-drop-down"
    }
  },

  /**
   * Called when animation finishes on the dropdown (when opening or
   * closing). Responsible for "completing" the process of closing
   * the dropdown by setting its display to none.
   */
  _onNeonAnimationFinish: function() {
    // console.log("animation finished");
    if (!this.opened) {
      this.$.menu.style.display = "none";
      this._handleNewValue();
    }
  },

  /**
   * Processes a new value in 'immediateValue', updates 'value' if allowed (see noFreedom option)
   */
  _handleNewValue: function() {
    // if there is only one match, we auto-fill it
    if (this._filtereditems.length == 1) {
      this._inputvalue = this._filtereditems[0];
      this._setImmediateValue(this._inputvalue);
    }



    // just update the value if any input is allowed
    if (!this.noFreedom) {
      this.value = this.immediateValue;

    // if noFreedom is set, check for valid input and revert invalid input
    } else {
      var match = false;

      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (item.value && item.value == this.immediateValue) {
          match = true;
        } else if (typeof item === 'string' || item instanceof String) {
          if (item == this.immediateValue) {
            match = true;
          }
        }
      }

      // reset to original value if no match is found
      if (!match) {
        this._inputvalue = this.value;
      } else {
        this.value = this.immediateValue;
      }
    }
  },

  _valueChanged: function(newval, oldval) {
    this._inputvalue = newval;
    this._setImmediateValue(newval);
    this._handleNewValue();
  },

  _inputvalueChanged: function(value) {
    this._setImmediateValue(value);
  }

});
