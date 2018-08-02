import Vue from 'vue';
import vueFormPlugin from './../../../src';

Vue.use(vueFormPlugin);

import DevApp from './DevApp.vue';

Vue.component('dev-app', DevApp);

new Vue({
  el: '#devApp',
});