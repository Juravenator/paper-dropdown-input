/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
`paper-dropdown-input` implements a searchable dropdown menu.
It is derived from the `paper-dropdown-menu` element, and shares most of its
functionality.

Simple example:

    <paper-dropdown-input label="Your favorite dinosaur" items='["Velociraptor","Deinonychus","Allosaurus","Brontosaurus","Carcharodontosaurus","Diplodocus","T-Rex"]'></paper-dropdown-input>

Custom content example:

    <paper-dropdown-input label="Your favorite dinosaur" items='[[complexItems]]'>
      <template>
        <~~ polymer 1.x ~~>
        <template is="dom-repeat" items="[[items]]" as="item">
          <dinosaur-card data="[[item]]"></dinosaur-card>
        </template>
        <~~ polymer 2.x ~~>
        <dom-repeat items="[[items]]" as="dino">
          <template>
            <dinosaur-card data="[[dino]]"></dinosaur-card>
          </template>
        </dom-repeat>
      </template>
    </paper-dropdown-input>

### Styling
Styling is exactly the same as the `paper-dropdown-menu` element:

Custom property | Description | Default
----------------|-------------|----------
`--paper-dropdown-menu` | A mixin that is applied to the element host | `{}`
`--paper-dropdown-menu-disabled` | A mixin that is applied to the element host when disabled | `{}`
`--paper-dropdown-menu-ripple` | A mixin that is applied to the internal ripple | `{}`
`--paper-dropdown-menu-button` | A mixin that is applied to the internal menu button | `{}`
`--paper-dropdown-menu-input` | A mixin that is applied to the internal paper input | `{}`
`--paper-dropdown-menu-icon` | A mixin that is applied to the internal icon | `{}`

You can also use any of the `paper-input-container` and `paper-menu-button`
style mixins and custom properties to style the internal input and menu button
respectively.

@group Paper Elements
@element paper-dropdown-input
@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import "@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-input/iron-input.js";
import { IronValidatableBehavior } from "@polymer/iron-validatable-behavior/iron-validatable-behavior.js";
import { IronButtonState } from "@polymer/iron-behaviors/iron-button-state.js";
import { IronFormElementBehavior } from "@polymer/iron-form-element-behavior/iron-form-element-behavior.js";
import { IronControlState } from "@polymer/iron-behaviors/iron-control-state.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu-icons.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu-shared-styles.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-styles/default-theme.js";
import { PolymerElement } from "@polymer/polymer";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class";
import { dom as dom$0 } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { Templatizer } from "@polymer/polymer/lib/legacy/templatizer-behavior.js";
// import { templatize } from '@polymer/polymer/lib/utils/templatize.js';
import * as gestures from "@polymer/polymer/lib/utils/gestures.js";
import { html } from "@polymer/polymer/lib/utils/html-tag.js";
import "@polymer/polymer/polymer-legacy.js";

class PaperDropdownInput extends mixinBehaviors(
  [
    IronButtonState,
    IronControlState,
    IronFormElementBehavior,
    Templatizer,
    IronValidatableBehavior
  ],
  PolymerElement
) {
  static get template() {
    return html`
      <style include="paper-dropdown-menu-shared-styles"></style>

      <style>
        :host([no-search]) [search-bar] {
          display: none;
        }

        :host ::content hr {
          border-top: 1px solid var(--disabled-text-color);
          border-bottom: none;
          opacity: 0.5;
        }

        .dropdown-content > paper-input {
          padding-left: 1em;
          --paper-input-container-input-color: black;
          --paper-input-container-underline: {
            display: none;
          }
          --paper-input-container-underline-focus: {
            display: none;
          }
          --paper-input-container: {
            padding: 0;
          }
        }

        paper-menu-button {
          --paper-input-container-input-color: let(--primary-text-color);
        }

        .dropdown-content > p {
          padding-left: 1em;
        }

        [search-bar] {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        [search-bar] iron-input {
          flex: 1;
          display: flex;
          flex-direction: row;
        }

        [search-bar] input {
          border: none;
          flex: 1;
          outline: none;
          font-size: 1em;
          min-width: 0;
          margin-bottom: 3px;
        }

        [search-bar] iron-icon {
          margin-left: 1em;
        }

        [warning] {
          background: #ffe0b2;
          /* paper-orange-100 */
          margin: 0;
          padding: 0.5em 1em;
        }

        #searchInput {
          max-width: 190px;
        }
      </style>

      <!-- this div fulfills an a11y requirement for combobox, do not remove -->
      <span role="button"></span>
      <paper-menu-button
        id="menuButton"
        vertical-align="[[verticalAlign]]"
        horizontal-align="[[horizontalAlign]]"
        dynamic-align="[[dynamicAlign]]"
        vertical-offset="[[_computeMenuVerticalOffset(noLabelFloat)]]"
        disabled="[[_disabledOrReadonly(disabled, readonly)]]"
        no-animations="[[noAnimations]]"
        on-iron-select="_onIronSelect"
        on-iron-deselect="_onIronDeselect"
        opened="{{opened}}"
        close-on-activate=""
        no-overlap=""
        allow-outside-scroll="[[allowOutsideScroll]]"
        restore-focus-on-close="[[restoreFocusOnClose]]"
      >
        <!--
          support hybrid mode: user might be using paper-menu-button 1.x which distributes via <content>
        -->
        <div class="dropdown-trigger" slot="dropdown-trigger">
          <paper-ripple></paper-ripple>
          <!-- paper-input has type="text" for a11y, do not remove -->
          <paper-input
            type="text"
            invalid="[[invalid]]"
            readonly=""
            disabled="[[disabled]]"
            name="[[name]]"
            value="[[selectedItemLabel]]"
            placeholder="[[placeholder]]"
            error-message="[[errorMessage]]"
            always-float-label="[[alwaysFloatLabel]]"
            no-label-float="[[noLabelFloat]]"
            label="[[label]]"
          >
            <!--
              support hybrid mode: user might be using paper-input 1.x which distributes via <content>
            -->
            <iron-icon
              icon="paper-dropdown-menu:arrow-drop-down"
              suffix=""
              slot="suffix"
            ></iron-icon>
          </paper-input>
        </div>
        <paper-listbox
          class="dropdown-content"
          slot="dropdown-content"
          id="menu"
          selectable="[[selectable]]"
          on-tap="_checkSelectChange"
          stop-keyboard-event-propagation=""
        >
          <div search-bar="" on-tap="_stopEvent" disabled="">
            <iron-icon icon="search"></iron-icon>
            <iron-input bind-value="{{searchValue}}">
              <input
                id="searchInput"
                value="{{value::input}}"
                is="iron-input"
                bind-value="{{searchValue}}"
              />
            </iron-input>
            <paper-icon-button
              on-click="clearSearch"
              icon="clear"
              alt="clear"
            ></paper-icon-button>
          </div>

          <template is="dom-if" if="[[tooBig]]">
            <p warning="" disabled="">
              <iron-icon icon="warning"></iron-icon>[[_displayMaxSize(labels,
              maxSize)]]
            </p>
          </template>
          <template is="dom-if" if="[[!_filtereditems.length]]">
            <template
              is="dom-if"
              if="[[!_showFreeInput(freedom, searchValue)]]"
            >
              <p warning="" disabled="">[[_displayNoResults(labels)]]</p>
            </template>
            <template is="dom-if" if="[[_showFreeInput(freedom, searchValue)]]">
              <p warning="" disabled="">
                No results were found <br />would you like to use the search
                value?
              </p>
              <paper-item>[[searchValue]]</paper-item>
            </template>
          </template>
          <slot id="content"></slot>
        </paper-listbox>
      </paper-menu-button>

      <template id="menuTemplate">
        <template is="dom-repeat" items="[[items]]" as="item">
          <paper-item>[[item]]</paper-item>
        </template>
      </template>
    `;
  }

  static get is() {
    return "paper-dropdown-input";
  }

  static get properties() {
    return {
      /**
       * The derived "label" of the currently selected item. This value
       * is the `label` property on the selected item if set, or else the
       * trimmed text content of the selected item.
       */
      selectedItemLabel: {
        type: String,
        notify: true,
        readOnly: true
      },

      /**
       * The last selected item. An item is selected if the dropdown menu has
       * a child with slot `dropdown-content`, and that child triggers an
       * `iron-select` event with the selected `item` in the `detail`.
       *
       * @type {?Object}
       */
      selectedItem: {
        type: Object,
        notify: true,
        readOnly: true
      },

      /**
       * The value for this element that will be used when submitting in
       * a form. It is read only, and will always have the same value
       * as `selectedItemLabel`.
       */
      value: {
        type: String,
        notify: true,
        readOnly: true
      },

      /**
       * The label for the dropdown.
       */
      label: {
        type: String
      },

      /**
       * The placeholder for the dropdown.
       */
      placeholder: {
        type: String
      },

      /**
       * The error message to display when invalid.
       */
      errorMessage: {
        type: String
      },

      /**
       * True if the dropdown is open. Otherwise, false.
       */
      opened: {
        type: Boolean,
        notify: true,
        value: false,
        observer: "_openedChanged"
      },

      /**
       * By default, the dropdown will constrain scrolling on the page
       * to itself when opened.
       * Set to true in order to prevent scroll from being constrained
       * to the dropdown when it opens.
       */
      allowOutsideScroll: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to disable the floating label. Bind this to the
       * `<paper-input-container>`'s `noLabelFloat` property.
       */
      noLabelFloat: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Set to true to always float the label. Bind this to the
       * `<paper-input-container>`'s `alwaysFloatLabel` property.
       */
      alwaysFloatLabel: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to disable animations when opening and closing the
       * dropdown.
       */
      noAnimations: {
        type: Boolean,
        value: false
      },

      /**
       * The orientation against which to align the menu dropdown
       * horizontally relative to the dropdown trigger.
       */
      horizontalAlign: {
        type: String,
        value: "left"
      },

      /**
       * The orientation against which to align the menu dropdown
       * vertically relative to the dropdown trigger.
       */
      verticalAlign: {
        type: String,
        value: "top"
      },

      /**
       * If true, the `horizontalAlign` and `verticalAlign` properties will
       * be considered preferences instead of strict requirements when
       * positioning the dropdown and may be changed if doing so reduces
       * the area of the dropdown falling outside of `fitInto`.
       */
      dynamicAlign: {
        type: Boolean
      },

      /**
       * Whether focus should be restored to the dropdown when the menu closes.
       */
      restoreFocusOnClose: {
        type: Boolean,
        value: true
      },

      /**
       * The maximum amount of items the dropdown will render
       * User will be asked to enter a more specific query if this
       * threshold is exceeded
       */
      maxSize: {
        type: Number,
        value: 50
      },
      /**
       * Set to true if the maxSize threshold is exceeded
       */
      tooBig: {
        type: Boolean,
        notify: true,
        readOnly: true
      },

      /**
       * If set, the user can choose to use the entered search query
       * as the value.
       * This makes the element behave more like an autocompletion element.
       */
      freedom: {
        type: Boolean,
        value: false
      },

      /**
       * The items that this element will filter on, and present to the
       * user if it matches the user's search query
       */
      items: {
        type: Array,
        value: function() {
          return [];
        },
        observer: "_itemsChanged"
      },

      labels: {
        type: Object,
        value: () => ({
          tooMany: "Only showing the first MAX_SIZE items",
          noResult: "No results were found"
        })
      },

      /**
       * The current search query entered by the user
       */
      searchValue: {
        type: String,
        notify: true,
        value: ""
      },

      /**
       * The property name that items will have that paper-dropdown-input
       * can filter on
       */
      filterProperty: {
        type: String,
        value: "value"
      },

      /**
       * The filter function, executed each time 'items' or 'searchValue' changes
       * The default function expects an array of strings or an array of
       * objects containing the 'value' property
       */
      filter: {
        type: Function,
        value: function() {
          return function(items, searchValue, filterProperty) {
            // older version of filter did not have filterProperty as an argument
            // fallback for backwards compatibility
            if (!filterProperty) {
              filterProperty = this.filterProperty;
            }
            if (!searchValue) {
              return items;
            } else {
              let _searchValue = searchValue.toLowerCase();
              return items.filter(function(item) {
                // parse to String to handle number type
                item = item.toString();
                if (!item[filterProperty] && typeof item != "string") {
                  console.error(
                    "paper-dropdown-input: item in `items`:",
                    item,
                    " is not a string or does not contain `" +
                      filterProperty +
                      "` property"
                  );
                  return true; // everything goes through
                } else {
                  return (
                    (item[filterProperty] || item)
                      .toLowerCase()
                      .indexOf(_searchValue) > -1
                  );
                }
              });
            }
          };
        }
      },

      /**
       * The remaining items after filtering.
       * These are shown to the user in the dropdown.
       * This list is truncated if 'maxSize' is exceeded
       */
      _filtereditems: {
        type: Array,
        computed: "_filterItems(items, searchValue, filterProperty)"
      },

      /**
       * Makes the element read-only. The dropdown will not open.
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * passed to paper-listbox.
       * https://www.webcomponents.org/element/PolymerElements/paper-listbox/paper-listbox#property-selectable
       */
      selectable: {
        type: String
      },

      /**
       * disables search, making it more like a regular dropdown.
       */
      noSearch: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  _itemsChanged(item) {
    console.log("item", item);
  }

  listeners() {
    return {
      tap: "_onTap",
      "dom-change": "_refit"
      // 'neon-animation-finish': '_focusSearch'
    };
  }

  keyBindings() {
    return {
      "up down": "open",
      esc: "close"
    };
  }

  hostAttributes() {
    return {
      role: "combobox",
      "aria-autocomplete": "none",
      "aria-haspopup": "true"
    };
  }

  static get observers() {
    return [
      "_selectedItemChanged(selectedItem)",
      "_updateTemplate(_filtereditems)",
      "_updateSelectedItem(items.length, selectedItemLabel, filterProperty)",
      "_updateSelectedItemLabel(items, value, filterProperty)"
    ];
  }

  ready() {
    super.ready();
    // NOTE(cdata): Due to timing, a preselected value in a `IronSelectable`
    // child will cause an `iron-select` event to fire while the element is
    // still in a `DocumentFragment`. This has the effect of causing
    // handlers not to fire. So, we double check this value on attached:
    let contentElement = this.contentElement;
    if (contentElement && contentElement.selectedItem) {
      this._setSelectedItem(contentElement.selectedItem);
    }
    if (!this._isSetupTemplate) {
      this._isSetupTemplate = true;
      this._setupTemplate();
    }
  }

  /**
   * The content element that is contained by the dropdown menu, if any.
   */
  get contentElement() {
    return this.$.menu;
  }

  _displayMaxSize(labels, maxSize) {
    if (!labels) {
      return;
    }
    return labels.tooMany.replace("MAX_SIZE", maxSize);
  }

  _displayNoResults(labels) {
    if (!labels) {
      return;
    }
    return labels.noResult;
  }

  /**
   * Show the dropdown content.
   */
  open() {
    this.$.menuButton.open();
  }

  /**
   * Hide the dropdown content.
   */
  close() {
    this.$.menuButton.close();
  }

  /**
   * A handler that is called when `iron-select` is fired.
   *
   * @param {CustomEvent} event An `iron-select` event.
   */
  _onIronSelect(event) {
    this._setSelectedItem(event.detail.item);
  }

  /**
   * A handler that is called when `iron-deselect` is fired.
   *
   * @param {CustomEvent} event An `iron-deselect` event.
   */
  _onIronDeselect(event) {
    this._setSelectedItem(null);
  }

  /**
   * A handler that is called when the dropdown is tapped.
   *
   * @param {CustomEvent} event A tap event.
   */
  _onTap(event) {
    if (gestures.findOriginalTarget(event) === this) {
      this.open();
    }
  }

  /**
   * Compute the label for the dropdown given a selected item.
   *
   * @param {Element} selectedItem A selected Element item, with an
   * optional `label` property.
   */
  _selectedItemChanged(selectedItem) {
    if (this.opened) {
      // user is searching
      return;
    }
    let value = "";
    let displayValue = "";
    if (!selectedItem) {
      value = "";
    } else {
      displayValue = selectedItem.textContent.trim() || selectedItem.label;
      value =
        selectedItem.label ||
        selectedItem.getAttribute("label") ||
        selectedItem.textContent.trim();
    }
    if (!value && this.selectedItemLabel) {
      // selected item re-appeared in _filteredItems
      return;
    }
    this._setValue(value);
    // this._setSelectedItemLabel(value);
    this._setSelectedItemLabel(displayValue);
  }

  /**
   * Compute the vertical offset of the menu based on the value of
   * `noLabelFloat`.
   *
   * @param {boolean} noLabelFloat True if the label should not float
   * above the input, otherwise false.
   */
  _computeMenuVerticalOffset(noLabelFloat) {
    // NOTE(cdata): These numbers are somewhat magical because they are
    // derived from the metrics of elements internal to `paper-input`'s
    // template. The metrics will change depending on whether or not the
    // input has a floating label.
    return noLabelFloat ? -4 : 8;
  }

  /**
   * Returns false if the element is required and does not have a selection,
   * and true otherwise.
   * @param {*=} _value Ignored.
   * @return {boolean} true if `required` is false, or if `required` is true
   * and the element has a valid selection.
   */
  _getValidity(value) {
    return this.disabled || !this.required || (this.required && !!this.value);
  }

  _openedChanged() {
    let openState = this.opened ? "true" : "false";
    let e = this.contentElement;
    if (e) {
      e.setAttribute("aria-expanded", openState);
    }
    if (openState) {
      setTimeout(this._focusSearch.bind(this), 100);
    }
  }

  _focusSearch() {
    this.$.searchInput.focus();
    this.$.searchInput.select();
  }

  /**
   * Sets up the template
   */
  _setupTemplate() {
    // when the user clears the search field, the selectedItem is null
    // this causes an iron-select event causing the dropdown to close
    this.$.menuButton._onIronSelect = function(event) {
      let value =
        this.selectedItem &&
        (this.selectedItem.label ||
          this.selectedItem.getAttribute("label") ||
          this.selectedItem.textContent.trim());
      if (!value && this.selectedItemLabel) {
        return;
      }
      if (!this.ignoreSelect) {
        this.$.menuButton.close();
      }
    }.bind(this);

    // normally a user can select an option by typign the first letter
    // this clashes with the search field
    this.$.menu._focusWithKeyboardEvent = function() {};

    let template = dom$0(this).querySelector("template") || this.$.menuTemplate;
    // const toto = templatize(template, this, { items: this._filtereditems });
    this.templatize(template);
    this._templateInstance = this.stamp({
      items: this._filtereditems
    });
    // this._templateInstance = new toto();
    let dom = dom$0(this);
    dom.appendChild(this._templateInstance.root);
    console.log("dom", dom);
    console.log("templateIsbntnace", this._templateInstance.root);
    // dom.insertBefore(this._templateInstance.root, dom.firstChild);
  }

  /**
   * Updates the stamped template's data
   *
   * @param {Array.<Object>} filtereditems the new list to display in the dropdown
   */
  _updateTemplate(filtereditems) {
    if (this._templateInstance) {
      this._templateInstance.items = filtereditems;
    }
  }

  _refit() {
    if (this.opened) {
      this.$.menuButton.$.dropdown.refit();
    }
  }

  /**
   * Returns a filtered version of items, based on if the array object matched 'searchValue'
   *
   * @param {Array.<Object>} items the array of items to filter
   * @param {String} searchValue value to filter with
   * @return {Array.<Object>} the filtered array
   */
  _filterItems(items, searchValue, filterProperty) {
    let result = this.filter
      ? this.filter(items, searchValue, filterProperty)
      : items;
    if (this.maxSize > 0) {
      this._setTooBig(result.length > this.maxSize);
      return result.slice(0, this.maxSize);
    } else {
      this._setTooBig(false);
      return result;
    }
  }

  _stopEvent(event) {
    event.stopPropagation();
  }

  /**
   * Clears 'searchValue' and focuses the search input
   */
  clearSearch(event) {
    event && this._stopEvent(event);
    this.searchValue = "";
    this._focusSearch();
    this.dispatchEvent(
      new CustomEvent("stet-clear", {
        bubbles: true,
        composed: true
      })
    );
  }

  _updateSelectedItem(itemsLength, selectedItemLabel, filterProperty) {
    let displayValue =
      this.selectedItem &&
      (this.selectedItem.textContent.trim() || this.selectedItem.label);
    let value =
      this.selectedItem &&
      (this.selectedItem.label ||
        this.selectedItem.getAttribute("label") ||
        displayValue);
    if (selectedItemLabel && value != selectedItemLabel) {
      let index = this.$.menu.items.findIndex(function(item) {
        return (
          item.label == selectedItemLabel ||
          item[filterProperty] == selectedItemLabel ||
          item.value == selectedItemLabel ||
          item == selectedItemLabel
        );
      });
      index > -1 && this.$.menu.select(index);
    }
  }

  _updateSelectedItemLabel(items, value, filterProperty) {
    if (value === undefined) {
      return;
    }
    if (value === null || value == "") {
      this._setSelectedItemLabel(null);
      this._setSelectedItem(null);
      this.$.menu.selected = null;
      return;
    }
    let selectedItem = items.find(function(item) {
      return (
        item[filterProperty] == value || item.label == value || item == value
      );
    });
    if (selectedItem) {
      let displayValue =
        selectedItem[filterProperty] || selectedItem.label || selectedItem;
      this._setSelectedItemLabel(displayValue);
    } else {
      this.$.menu.selected = null;
      if (this.freedom) {
        this._setSelectedItemLabel(value);
      } else {
        this._setSelectedItemLabel(null);
      }
    }
  }

  /*
   * selectedItem can get screwed up.
   * say you selected the first item in the list, and you start searching.
   * You click the first item in the filtered list, the change will not
   * get picked up. This fixed this edge case.
   */
  _checkSelectChange(event) {
    // execute ~after~ the normal update flow
    // otherwise we would always detect the edge case
    setTimeout(
      function() {
        if (!this.selectedItemLabel) {
          return;
        }

        // 'Polymer.dom(event.detail.sourceEvent).localTarget' is erroring out with Firefox
        // when running in a full Polymer 2.x context
        let selectedItem;
        if (event.composedPath && event.composedPath()[0]) {
          selectedItem = event.composedPath()[0];
        } else {
          selectedItem = dom$0(event.detail.sourceEvent).localTarget;
        }

        let selectedItemLabel =
          selectedItem.textContent.trim() || selectedItem.label;

        if (selectedItemLabel !== this.selectedItemLabel) {
          this.opened = false;
          this._selectedItemChanged(this.selectedItem);
        }
      }.bind(this),
      0
    );
  }

  _disabledOrReadonly(disabled, readonly) {
    return disabled || readonly;
  }

  _showFreeInput(freedom, searchValue) {
    return freedom && searchValue != "";
  }
}

window.customElements.define("paper-dropdown-input", PaperDropdownInput);
