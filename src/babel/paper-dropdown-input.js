Polymer({
  is: 'paper-dropdown-input',

  behaviors: [
    Polymer.IronFormElementBehavior,
    Polymer.PaperInputBehavior,
    Polymer.Templatizer,
    Polymer.NeonAnimationRunnerBehavior
  ],

  properties: {
    items: {
      type: Array,
      value: []
    },
    _filtereditems: {
      type: Array,
      computed: '_filterItems(items, value)',
      observer: '_updateTemplate'
    },
    _templateInstance: Object,

    opened: {
      type: Boolean,
      observer: "_openedChanged"
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

  _filterItems: function(items, value) {
    var result = [];
    for (var i = 0; i < items.length; i++) {
      var include = false;
      if (items[i].value) {
        include = items[i].value.toLowerCase().indexOf(value) > -1;
      } else if (typeof items[i] === 'string' || items[i] instanceof String) {
        include = items[i].toLowerCase().indexOf(value) > -1;
      } else {
        console.error("paper-dropdown-input: item in `items`:", items[i], " is not a string or does not contain `value` property")
      }
      if (include) {
        result.push(items[i]);
      }
    }
    return result;
  },

  _onClick: function(event) {
    var selectedItem = Polymer.dom(event).localTarget;
    if (selectedItem) {
      this.value = selectedItem.value || selectedItem.label || selectedItem.textContent.trim();
    }
  },

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

  _clearInput: function() {
    this.value = "";
  },

  _getIcon: function(value) {
    if (value && value != "") {
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
    }
  },

});
