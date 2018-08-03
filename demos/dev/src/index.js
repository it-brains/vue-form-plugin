import Vue from 'vue';
import vueFormPlugin from './../../../src';

const pluginConfig = {
  validationMessagesResponseKey: 'errors',
  commonHttpHeaders: {
    'X-CSRF-TOKEN': 'token_value',
    'X-Requested-With': 'XMLHttpRequest',
  }
};
Vue.use(vueFormPlugin, pluginConfig);

import DevApp from './DevApp.vue';

Vue.component('demo-app', DevApp);

new Vue({
  el: '#demoApp',
});