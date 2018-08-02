import Vue from 'vue';
import vueFormPlugin from './../../../src';

Vue.use(vueFormPlugin);

import DevApp from './DevApp.vue';

Vue.component('demo-app', DevApp);

new Vue({
  el: '#demoApp',
});