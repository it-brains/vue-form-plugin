## VueJS form plugin
This is a simple wrapper for HTTP requests.

## Table of contents
1. [Installation](#installation)
2. [Basic usage](#basic-usage)
3. [Form class](#form-class)
4. [Examples](#examples)
5. [Notes](#notes)


## Installation
Using npm:
```shell
npm install vuejs-form-plugin
```

## Basic usage
This wrapper ships as a simple VueJS plugin and can be included to your project to appropriate way:
```js
import VuejsFormPlugin from 'vuejs-form-plugin';
 
Vue.use(VuejsFormPlugin);
```

You can pass JS object for configuration of this plugin as the second param for `Vue.use`.
The configuration object can contain the following options:

- `formClassName` - name of the form class. Default value is `Form`
- `validationMessageComponentName` - name of component which will display validation messages. Default value is `validation-message`
- `formDirectiveName` - name of directive which is using for injecting errors into validation message components. Default value is `form`
- `clearValidationMessageWithInputChange` - determines if validation message should be cleaned after changing of appropriate input, related with this error. 
Default value is `true`

For using of the wrapper just create instance of `Form`(can be changed with `formClassName` option) class with needed fields:
```html
<template>
  .....
</template>

<script>
  export default {
    data() {
      return {
        form: new Form({
          name: '',
          city: '',
          state: '',
        }),
      }
    }
  }
</script>
```

If you want to display validation messages from server:
1. Add `v-form` (can be changed with `formDirectiveName` option) directive to the wrapper of all your inputs which are use `Form` instance. 
You need to pass your form instance to this directive.
2. Add `validation-message` (can be changed with option `validationMessageComponentName`) component with property `property-name` in a needed place.
Property `property-name` determines key of validation message which returns from server. If you don't want to use `v-form` directive
you can pass `errors` property to this component. In this case you need to pass property `errors` of your form instance into this property of 
component.
3. If you want the validation message to disappear automatically after changing of the appropriate input, you need to specify `name` attribute of this input.
This `name` attribute should have the same value as the value passed into `property-name` of the appropriate `validation-message` component.

Example:
```html
<template>
  <div v-form="form">
    <div>
      <label>First name:</label>
      <input v-model="form.f_name" name="f_name">
      <validation-message property-name="f_name"></validation-message>
    </div>

    <div>
      <label>Last name:</label>
      <input v-model="form.l_name" name="l_name">
      <validation-message property-name="l_name"></validation-message>
    </div>

    <div>
      <label>City</label>
      <select v-model="form.city" name="city">
        <option value="city1">City1</option>
        <option value="city2">City2</option>
      </select>
      <validation-message property-name="city"></validation-message>
    </div>

    <div>
      <button type="button" @click.prevent="submit">Submit</button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: new Form({
          f_name: '',
          l_name: '',
          city: 'city1',
        }),
      }
    },
    methods: {
      submit() {
        this.form.post('test');
      }
    }
  }
</script>
```

## Form class
The title of the class can be overridden with `formClassName` option of plugin.

Constructor of the class takes two arguments:
- `data` - JS object with needed fields
- `headers` - optional. JS object with HTTP headers which will be passed with every HTTP request

Form class ships with the next methods:
- `get(url[, params, headers, successCallback, errorCallback])` - makes GET request to the server. Return current instance of the class
- `post(url[, headers])` - makes POST request to the server. Returns promise
- `put(url[, headers])` - makes PUT request to the server. Returns promise
- `patch(url[, headers])` - makes PATCH request to the server. Returns promise
- `delete(url[, headers])` - makes DELETE request to the server. Returns promise

Params:
- `url` - string with URL address for the request
- `params` - optional. JS object with GET params for the requests
- `headers` - optional. JS object with HTTP headers which will be passed with current request. If this object has the same HTTP headers as
headers which were passed with constructor of the class, constructor's headers will be overridden
- `successCallback` - optional. Callback function which will be called after success request
- `errorCallback` - optional. Callback function which will be called after failed request

Form class includes instance of `Errors` class (as an `errors` property) which contains returned validation messages. Methods of 
errors class:
- `has(field)` - determines if there is an error by given field name
- `any()` - determines if there is any error
- `get(field)` - returns the first error by given field name
- `clear([field])` - clears ALL errors if 'field' did not passed or only specific errors by given field name if it was

Form class contains internal property `_processing ` which can be used for determines if HTTP request is in progress.

## Examples
GET request:
```html
<template>
  <div v-form="form">
    <div v-show="form._processing">Processing...</div>
    <div>
      <label>First name:</label>
      <input v-model="form.f_name" name="f_name">
      <validation-message property-name="f_name"></validation-message>
    </div>

    <div>
      <label>Last name:</label>
      <input v-model="form.l_name" name="l_name">
      <validation-message property-name="l_name"></validation-message>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: new Form({
          f_name: '',
          l_name: '',
        }).get('user', {id: 1}, this.successCallback),
      }
    },
    methods: {
      successCallback(data) {
        alert('Yeah! The fresh user data just arrived!');
        console.log(data);
      },
    }
  }
</script>
```

POST request:
```html
<template>
  <div v-form="form">
    <div v-show="form._processing">Processing...</div>
    <div>
      <label>Coupon code:</label>
      <input v-model="form.coupon_code" name="coupon_code">
      <validation-message property-name="coupon_code"></validation-message>
    </div>
    <div>
      <label>Discount type:</label>
      <select v-model="form.discount_type" name="discount_type">
        <option value="percent">Percent</option>
        <option value="fixed">Fixed</option>
      </select>
      <validation-message property-name="discount_type"></validation-message>
    </div>
    <button @click.precent="submitCode">Get my discount!</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: new Form({
          coupon_code: '',
          discount_type: 'percent',
        }),
      }
    },
    methods: {
      submitCode() {
        this.form.post('discount').then(data => {
          alert("Yeaah. I've got it!");
        }).catch(error => {
          alert('Noooo!');
        })
      }
    }
  }
</script>
```
## Notes
TODO