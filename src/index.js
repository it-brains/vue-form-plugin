import Form from './Form'
import config from './config'
import ValidationMessage from './components/ValidationMessage.vue'
import FormDirective from './directives/FormDirective.js'
import axios from 'axios';

let configData = {};

function registerForm() {
  window[configData.formClassName] = Form;
}

function registerComponent(Vue) {
  Vue.component(configData.validationMessageComponentName, ValidationMessage);
}

function registerDirective(Vue) {
  FormDirective.register(Vue, configData);
}

function fillCommonHttpHeaders() {
  axios.defaults.headers.common = configData.commonHttpHeaders;
}

export default {
  install (Vue, customConfig = {}) {
    window._vueFormPluginConfig = configData = config.get(customConfig);

    registerForm();

    registerComponent(Vue);

    registerDirective(Vue);

    fillCommonHttpHeaders();
  }
}
