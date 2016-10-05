_[Demo and API Docs](https://juravenator.github.io/paper-dropdown-input/components/paper-dropdown-input/)_

# paper-dropdown-input
A paper-input that provides the user with input suggestions

## Example

```html
    <paper-dropdown-input label="Your favorite dinosaur" items='["Velociraptor","Deinonychus","Allosaurus","Brontosaurus","Carcharodontosaurus","Diplodocus","T-Rex"]'></paper-dropdown-input>
```

<!-- ![easy example](http://i.giphy.com/N3u96ehw98YTK.gif "easy example") -->

## Custom template example

```html
    <paper-dropdown-input label="Your favorite dinosaur" items='[[complexItems]]'>
      <template>
        <template is="dom-repeat" items="[[items]]" as="item">
          <dinosaur-card data="[[item]]"></dinosaur-card>
        </template>
      </template>
    </paper-dropdown-input>
```

Where `complexItems` is an arry of object, every object must contain at least the `value` property.

<!-- ![example using templates](http://i.imgur.com/FD26RkN.png "example using templates") -->

## Styling
The items in the dropdown list reside in the light DOM, so you are free to style them however you like.

The actual dropdown-input can be styled as follows:

```css
:host {
  --paper-dropdown-input-clear-button-color: green;
}
paper-dropdown-input {
  color: white;
}
```
