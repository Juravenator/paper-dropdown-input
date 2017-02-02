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
      value: [],
      observer: "_itemsChanged"
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

    selectedIndex: {
      type: Number,
      notify: true
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

  observers: ['_selectedIndexChanged(selectedIndex)'],

  /*
   * if the items changed, re-evaluate the current value
   */
  _itemsChanged: function(items) {
    if (items) {
      var match = items.find(item => item.value == this.value);
      if (match) {
        this._inputvalue= match.value;
      } else if (this.noFreedom) {
        this._inputvalue= "";
      }
    }
  },

  /**
   * Fires when selectedIndex changes, used to respond to externally triggered changes (el.selectedIndex = x)
   *
   * @param {Number} selectedIndex
   */
  _selectedIndexChanged: function(selectedIndex) {
    if (selectedIndex == undefined) {
      this.clear();
    } else if (this.items && this.items[selectedIndex]) {
      // if the selected index does not match the selected value, update the value
      if (this.value != this.items[selectedIndex]) {
        this._setValueByItem(this.items[selectedIndex]);
      }
    }
  },

  /**
   * Returns a filtered version of items, based on if the array object matched 'immediateValue'
   *
   * @param {Array.<Object>} items the array of items to filter
   * @param {String} immediateValue value to filter with
   * @return {Array.<Object>} the filtered array
   */
  _filterItems: function(items, immediateValue) {
    if (!immediateValue) {
      return items;
    } else {
      var _immediateValue = immediateValue.toLowerCase();
      return items.filter( item => {
        if (!item.value && typeof item != "string") {
          console.error("paper-dropdown-input: item in `items`:", item, " is not a string or does not contain `value` property");
          return true; // everything goes through
        } else {
          return (item.value || item).toLowerCase().indexOf(_immediateValue) > -1;
        }
      });
    }
  },

  /**
   * Fired when user clicks inside the dropdown menu.
   *
   * @param {Event} event the click event
   */
  _onClick: function(event) {
    var selectedItem = Polymer.dom(event).localTarget;
    if (selectedItem) {
      this._setValueByItem(selectedItem);
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

  _iconClicked: function() {
    this.clear();
    this.$.input.focus();
  },
  /**
   * Clears the current input
   */
  clear: function() {
    this._inputvalue= "";
  },

  _getIcon: function(immediateValue) {
    return (immediateValue && immediateValue != "") ? "close" : "arrow-drop-down";
  },

  /**
   * Called when animation finishes on the dropdown (when opening or
   * closing). Responsible for "completing" the process of closing
   * the dropdown by setting its display to none.
   */
  _onNeonAnimationFinish: function() {
    if (!this.opened) {
      this.$.menu.style.display = "none";
      this._handleNewValue();
    }
  },

  _setValueByItem: function(item) {
    this._inputvalue = this._getValueByItem(item);
  },

  _getValueByItem: function(item) {
    if (typeof item == "string") {
      return item;
    } else {
      return item.value || item.label || item.textContent.trim();
    }
  },

  /**
   * Processes a new value in 'immediateValue', updates 'value' if allowed (see noFreedom option)
   */
  _handleNewValue: function() {
    // if there is only one match, we auto-fill it
    if (this._filtereditems.length == 1) {
      this._setValueByItem(this._filtereditems[0]);
      this._setImmediateValue(this._inputvalue);
    }



    // just update the value if any input is allowed or if input is blank
    if (!this.noFreedom || this.immediateValue == "") {
      this.value = this.immediateValue;
      this.selectedIndex = this._getSelectedIndexByValue(this.value);

    // if noFreedom is set, check for valid input and revert invalid input
    } else {
      var match = this.items.some( item => {
        if (!item.value && typeof item != 'string') {
          return false
        } else {
          return (item.value || item) == this.immediateValue;
        }
      });

      // reset to original value if no match is found
      if (!match) {
        this._inputvalue = this.value;
      } else {
        this.value = this.immediateValue;
        this.selectedIndex = this._getSelectedIndexByValue(this.value);
      }
    }
  },

  _getSelectedIndexByValue: function(value) {
    for (var i = 0; i < this.items.length; i++) {
      var val = this._getValueByItem(this.items[i]);
      if (val == value) {
        return i;
      }
    }
  },

  _valueChanged: function(newval, oldval) {
    this._inputvalue = newval;
    // _inputvalueChanged might not be fired fast enough by observer alone
    this._inputvalueChanged(newval);
    this._handleNewValue();
  },

  _inputvalueChanged: function(value) {
    this._setImmediateValue(value);
  },

  _arrayIsEmpty: function(array) {
    return array.length == 0;
  }

});
