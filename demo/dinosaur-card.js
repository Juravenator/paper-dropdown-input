import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        border-bottom: 1px solid #E8E8E8;
      }
      [horizontal][layout] {
        width: 400px;
        display: flex;
        flex-direction: row;
      }
      img {
        width: 100px;
        height: 100px;
        min-width: 100px;
        min-height: 100px;
        padding: 5px;
        border-radius: 100px;
      }
    </style>

    <div horizontal="" layout="">
      <img src="[[data.avatar]]" alt="[[data.name]]">
      <div>
        <h3>[[data.value]]</h3>
        <p>[[data.description]]</p>
      </div>
    </div>
`,

  is: 'dinosaur-card',

  properties: {
    data: Object,
    label: {
      type: String,
      computed: "_getLabel(data)"
    }
  },

  listeners: {
    "tap": "dinotap"
  },

  dinotap: function(event) {
    console.log("dinotap", this);
  },

  _getLabel: function(data) {
    return data.dinoName;
  }
});
