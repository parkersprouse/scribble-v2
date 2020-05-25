# JavaScript / Vue Development Style Guide

## Linting

The app is linted using [ESLint](https://eslint.org/) with the [Airbnb rules](https://github.com/airbnb/javascript).  
Custom rules that are tweaked from the Airbnb rules are as follows:
- [`Require CamelCase (camelcase)`](https://eslint.org/docs/rules/camelcase) is `off`
- [`require quotes around object literal property names (quote-props)`](https://eslint.org/docs/rules/quote-props) is `off`
- [`require return statements to either always or never specify values (consistent-return)`](https://eslint.org/docs/rules/consistent-return) is `off`
- [`enforce consistent line breaks inside function parentheses (function-paren-newline)`](https://eslint.org/docs/rules/function-paren-newline) is `consistent`
- [`enforce a maximum line length (max-len)`](https://eslint.org/docs/rules/max-len) is set to `100` characters
- [`Require or disallow named function expressions (func-names)`](https://eslint.org/docs/rules/func-names) is `as-needed`

The linter must pass with no errors for a PR to be considered mergeable.

## Style Guide

For Vue components, follow the [official Vue style guide](https://vuejs.org/v2/style-guide).  
For CSS/SCSS standards, follow the [BEM convention](http://getbem.com/introduction/).

### Vue Style Guide Exceptions

All of the rules should be followed as stated in the official Vue style guide, except where stated below.

#### [Component style scoping](https://vuejs.org/v2/style-guide/#Component-style-scoping-essential)
Prefer using the BEM convention over using the `scoped` attribute for component styling.  
The `scoped` attribute can still be used when deemed necessary.
```vue
// Best
<template>
  <button class='button button--close'>X</button>
</template>

<!-- Using the BEM convention -->
<style lang='scss'>
.button {
  border: none;
  border-radius: 2px;
}

.button--close {
  background-color: red;
}
</style>
```

```vue
// OK
<template>
  <button class='button button-close'>X</button>
</template>

<!-- Using the `scoped` attribute -->
<style lang='scss' scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

#### [Single-file component filename casing](https://vuejs.org/v2/style-guide/#Single-file-component-filename-casing-strongly-recommended)
Use `snake_case` when naming folders and `PascalCase` when naming single-file components.
```
my_components/
|- MyComponent.vue
```

#### [Component name casing in templates](https://vuejs.org/v2/style-guide/#Component-name-casing-in-templates-strongly-recommended)
Use `kebab-case` when rendering a component.
```html
<my-component />
<!-- or -->
<my-component></my-component>
```

#### [Prop name casing](https://vuejs.org/v2/style-guide/#Prop-name-casing-strongly-recommended)
Prop names should use `snake_case` and events should use `camelCase`.  
This allows the reader to tell the difference between variables and methods at a glance.
```vue
props: {
  greeting_text: {
    type: String,
  },
}

<welcome-message
  greeting_text='hi'
 @greetingAcknowledged='onGreetingAcknowledged'
/>
```
This only applies to custom props/events for our own components - we obviously don't control prop/event names for libraries that we use.

#### [Quoted attribute values](https://vuejs.org/v2/style-guide/#Quoted-attribute-values-strongly-recommended)
All attribute values should be put in quotations, and single quotations should always be used.
```html
<input type='text'>
```
When providing an expression as the attribute value that uses quotation marks as part of the value, use double quotations in the value.
```html
<span :style='{ "background-color": current_background }'></span>
```

The linter will catch this in JavaScript, so this rule is to cover the uses of quotation marks in HTML and SCSS.

#### [Directive shorthands](https://vuejs.org/v2/style-guide/#Directive-shorthands-strongly-recommended)
Always use directive shorthands.
- `:` for `v-bind:`
- `@` for `v-on:`
- `#` for `v-slot:`

#### [Empty lines in component/instance options](https://vuejs.org/v2/style-guide/#Empty-lines-in-component-instance-options-recommended)
Always put spaces between multi-line properties and methods. This makes them much easier to read.
```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formatted_value() {
    // ...
  },

  input_classes() {
    // ...
  }
}
```

#### [Single-file component top-level element order](https://vuejs.org/v2/style-guide/#Single-file-component-top-level-element-order-recommended)
The order of component elements should always be
```vue
<template>
</template>

<script>
</script>

<style>
</style>
```
And the `<style></style>` section should only be included if it's being used.

#### [`v-if`/`v-else-if`/`v-else` without `key`](https://vuejs.org/v2/style-guide/#Priority-D-Rules-Use-with-Caution-Potentially-Dangerous-Patterns)
If the elements used in a `v-if`/`v-else-if`/`v-else` chain are the same type of DOM element, give them
each a unique `key` attribute to ensure that Vue updates the DOM correctly.
```html
<div
  v-if='error'
  key='search-status'
>
  Error: {{ error }}
</div>
<div
  v-else
  key='search-results'
>
  {{ results }}
</div>
```

### General Guidelines
These are guidelines not covered by any of the rules discussed in the above sections, but that should still be considered standard.

#### The How and Where of Styles
Always use SCSS over CSS

- Inside of a component
```vue
// MyComponent.vue

// Good
<style lang='scss'>
</style>

// Bad
<style>
</style>
```
- And in standalone stylesheets
```
// Good
assets/
|- styles.scss

// Bad
assets/
|- styles.css
```

If styles only apply to a specific component and will only ever apply to that component, define them inside of that component. Otherwise, define them inside of a global stylesheet.

- When the styles are for a component that will only ever apply to that component
```vue
// components/
// |- BaseModal.vue

<template>
  <div class='modal'></div>
</template>

<style lang='scss'>
  .modal {
    ...
  }
</style>
```

- When the styles are more generic and will be used across multiple components
```vue
// components/
// |- BaseModal.vue

<template>
  <h2 class='page-header'>Page Header</h2>
</template>

-----------

// assets/
// |- styles.scss

.page-header {
  ...
}
```

#### Variable / Method Naming
Variables should use the `snake_case` naming convention and methods should use the `camelCase` naming convention.  
Computed values count as variables for naming purposes since they are used as such.  
This allows the reader to tell the difference between variables and methods at a glance.
```js
export default {
  data() {
    return {
      my_variable: ...,
    };
  },
  methods: {
    myMethod() {
      ...
    },
  },
  computed: {
    my_computed_value() {
      ...
    },
  },
};
```

#### Attribute, Property, Method, Etc. Ordering
Everything not given a sort order covered by an above rule should default to alphabetical ordering.

This includes:  
- Standard HTML element attributes (after the higher-level [Vue style guide ordering](https://vuejs.org/v2/style-guide/#Element-attribute-order-recommended))
```html
<input
  id='name-input'
  v-model='name'
  ...
  class='input input--primary'
  placeholder='Name'
  type='text'
>
```

- Object properties
```js
// Standard object
const my_obj = {
  a: 1,
  b: 2,
  c: 3,
};

// Vue component state
export default {
  data() {
    return {
      a: 1,
      b: 2,
      c: 3,
    };
  },
};
```

- Methods
```js
methods: {
  firstCoolMethod() {
    ...
  },

  otherCoolMethod() {
    ...
  },

  veryCoolMethod() {
    ...
  },
},
```

#### Documentation
All methods, computed values, and watchers should be documented.  
The standard format of our documentation is as follows:
```js
/*
 * My useful description of what this method does.
 *
 * @param {ParamType} param_name
 *   description of what this parameter is
 * @return {ReturnType}
 *   description of the value that is returned, or empty if {void}
 */
function myMethod(param_name) {
  ...
}
```

Methods without parameters can leave out the `@params` section
```js
/*
 * My useful description of what this method does.
 *
 * @return {ReturnType}
 *   description of the value that is returned, or empty if {void}
 */
function myMethod() {
  ...
}
```
