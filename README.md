## VueJS form plugin
This is a simple wrapper for HTTP requests.

## Table of contents
1. [Installation](#installation)
2. [Basic usage](#basic-usage)
3. [Form class](#form-class)
4. [Working with files](#working-with-files)
5. [Transformers](#transformers)
6. [Examples](#examples)
7. [Notes](#notes)


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
- `validationMessageComponentName` - name of component which will display validation messages. Default value is 
`validation-message`
- `formDirectiveName` - name of directive which is using for injecting errors into validation message components. 
Default value is `form`
- `clearValidationMessageWithInputChange` - determines if validation message should be cleaned after changing of 
appropriate input, related with this error. Default value is `true`
- `validationMessagesResponseKey` - key of validation messages in response object. Default is empty (uses root data object)
- `validationErrorStatusCodes` - HTTP response codes of validation error. Can be scalar value (422, 500, etc) or array. 
Default value is 422
- `commonHttpHeaders` - HTTP headers which will be used with every request
- `errorHandlers` - function or array of functions which will be called after failed request with response object as 
parameter

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
1. Add `v-form` (can be changed with `formDirectiveName` option) directive to the wrapper of all your inputs which are 
use `Form` instance. You need to pass your form instance to this directive.
2. Add `validation-message` (can be changed with option `validationMessageComponentName`) component with property 
`property-name` in a needed place. Property `property-name` determines key of validation message which returns from 
server. If you don't want to use `v-form` directive you can pass `errors` property to this component. In this case 
you need to pass property `errors` of your form instance into this property of component.
3. If you want the validation message to disappear automatically after changing of the appropriate input, you need to 
specify `name` attribute of this input. This `name` attribute should have the same value as the value passed into 
`property-name` of the appropriate `validation-message` component.

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
The title of the class can be overridden with `formClassName` option of the plugin.

Constructor of the class takes two arguments:
- `data` - JS object with needed fields
- `exceptionParams` - array of fields which should be excluded from requests
- `headers` - optional. JS object with HTTP headers which will be passed with every HTTP request

Form class ships with the following methods:
- `get(url[, params, transformers, headers, successCallback, errorCallback])` - makes GET request to the server. Return current 
instance of the class
- `post(url[, headers])` - makes POST request to the server. Returns promise
- `put(url[, headers])` - makes PUT request to the server. Returns promise
- `patch(url[, headers])` - makes PATCH request to the server. Returns promise
- `delete(url[, params, headers])` - makes DELETE request to the server. Returns promise
- `setFileField(field[, event, value, callback])` - sets files property of form. See detailed description 
in [Working with files](#working-with-files) section.
- `reset()` - clears all fields passed through constructor. It can clear nested fields(at the first nesting level) as well.
- `useCustomAxios(axiosInstance)` - use given axios instance for requests.

Params:
- `url` - string with URL address for the request
- `params` - optional. JS object with params for GET and DELETE requests
- `transformers` - optional. JS object with transformers. Read about it in [transformers](#transformers) section
- `headers` - optional. JS object with HTTP headers which will be passed with current request. If this object has the 
same HTTP headers as headers which were passed with constructor of the class, constructor's headers will be overridden
- `successCallback` - optional. Callback function which will be called after success request
- `errorCallback` - optional. Callback function which will be called after failed request

Form class includes instance of `Errors` class (as an `errors` property) which contains returned validation messages. 
Methods of errors class:
- `has(field)` - determines if there is an error by given field name
- `any()` - determines if there is any error
- `get(field)` - returns the first error by given field name
- `clear([field])` - clears ALL errors if 'field' did not passed or only specific errors by given field name if it was

Form class contains internal property `_processing ` which can be used for determines if HTTP request is in progress.

## Working with files
As you may know there is no ability to assign `v-model` to an file input (because this input is read only). 
You can use `setFileField` event handler method of form class to simplify the process of setting selected files to 
property of form class instance. This method takes the following arguments:
- `field` - field name which will contain selected files
- `event` - optional. Event object
- `value` - optional. Value for setting
- `callback` - optional. Callback function which can be called after changing of file input

> **NOTE:** If you send files to server don't forget set 'Content-Type' request header to 'multipart/form-data' value.

Example:
```html
<template>
  <div v-form="form">
    <div v-show="form._processing">Processing...</div>
    <div>
      <label>Name:</label>
      <input v-model="form.name" name="name">
      <validation-message property-name="name"></validation-message>
    </div>
    <div>
      <label>Photo:</label>
      <input type="file" @change="form.setFileField('photo', $event, null, fileSelectedCallback)" name="photo" id="photo">
      <validation-message property-name="photo"></validation-message>
    </div>

    <button @click.prevent="submit">Submit</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: new Form({
          name: '',
          photo: null,
        }),
      }
    },
    methods: {
      submit() {
        this.form.post('photo', {'Content-Type': 'multipart/form-data'}).then(() => {
          document.getElementById('photo').value = '';
          this.form.setFileField('photo', null, null);   //Clear 'photo' field after successfully request
        });
      },
      fileSelectedCallback(field, event) {
        alert('Field "' + field + '" was set');
        console.log('Event object here: ', event);
      }
    }
  }
</script>
```

In this example:
1. We use `setFileField` as event handler for `change` event of file input. We pass field name 
('photo' in this case), `$event` object, `null` as `value` (because this `value` uses only for manually setting of field 
value - for cleaning of field for example. If we pass event object, `value` field will be ignored) and callback function 
(`fileSelectedCallback` in this case).
2. When `change` event of file input will be fired, `fileSelectedCallback` passed as the last parameter of `setFileField` 
event handler will be called with field name as the first parameter and `$event` object - as the second.
3. After successfully request we use `setFileField` method for cleaning of file field. For this we pass field name 
(`photo` in this case) `null` as event object and `null` as `value`.

## Transformers
Sometimes you may need to transform retrieved via 'GET' method data. For simplify this job you can use `transformers`.

Transformers - it is simply JS object which you can pass as third(optional) parameter of `get` method.
The keys of this object are the keys of retrieved from the server object of data. Let's see on the example of object of 
transformers:
```javascript
let transformers = {
  clients: {
    field: 'client_ids',
    property: 'id'
  },
  numbers: {
    func(item) {
      return item * 2;
    }
  }
};
```
In this case `client_ids` field will be added to your form instance. This field will be based on the 'clients' field of 
object retrieved from the server. `client_ids` field will contain array of IDs(property: 'id') of clients returned 
from the server - if server returned `clients` as array. If `clients` - it is simple object, `client_ids` will contain 
scalar value of 'id'.
`numbers` field of form instance will be replaced with new numbers field which will be got as result of function `func` 
for every element of `numbers` array(if it is array).

Common description of the using of transformers:
- transformers - it is simple JS object
- the keys of transformers object are the keys of object retrieved from the server
- each nested object of transformers object describes getting of resulted 'transformed' value
- each nested object of transformers object can contain the following fields: `field`, `property`, `func`
- `field` - determines the property name of form instance which will contain 'transformed' value. `field` property isn't 
required. If you don't pass this field, instead key of current nested transform object will be used
- `property` - determines the property of retrieved object which will be used as 'transformed' value. This field isn't 
required. Instead you can use conversion function passed in `func` property
- `func` - determines conversion function into which will be passed retrieved object. The result of this function will 
be used as 'transformed' value
- if you don't specify neither `property` nor `func` values, 'transformed' value won't be get

## Examples
GET request(with transformers):
```html
<template>
  <form v-form="form">
    <div>
      <label>Name</label>
      <input v-model="form.name" id="name" name="name">
      <validation-message property-name="name"></validation-message>
    </div>
    <div>
      <label>Parent name</label>
      <input v-model="form.parent.name" id="parent_name" name="parent_name">
      <validation-message property-name="parent_name"></validation-message>
    </div>
    <div>
      <label>Agent</label>
      <select v-model="form.agent_ids" multiple id="agent_ids" name="agent_ids">
        <option value="1">Agent1</option>
        <option value="2">Agent2</option>
        <option value="3">Agent3</option>
      </select>
      <validation-message property-name="agent_ids"></validation-message>
    </div>
  </form>
</template>

<script>
  const transformers = {
    agents: {
      field: 'agent_ids',
      property: 'id',
    },
    parent: {
      func(item) {
        item.name = item.full_name;

        return item;
      },
    }
  };

  export default {
    data() {
      return {
        form: new Form({
          name: null,
          parent: {
            name: null,
            age: null,
          },
          agent_ids: []
        }).get('/user', {}, transformers, {}, this.successCallback)
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
If you use some kind of framework for your backend you may need to make some configuration things for using of this 
plugin. 

For example if you use Laravel PHP framework you probably will need to configure `validationMessagesResponseKey` and 
most likely CSRF protection - `commonHttpHeaders`.

It can look like this:
```javascript
import vueFormPlugin from 'vuejs-form-plugin';

const pluginConfig = {
  validationMessagesResponseKey: 'errors',
  commonHttpHeaders: {
    'X-CSRF-TOKEN': 'token_value',
    'X-Requested-With': 'XMLHttpRequest',
  }
};
Vue.use(vueFormPlugin, pluginConfig);
```