import Errors from './Errors';
import axios from 'axios';
import Vue from 'vue';

export default class Form {

  /**
   * Class constructor
   *
   * @param {object} data
   * @param {object} headers
   */
  constructor(data, headers = {}) {
    this.originalData = data;

    for (let field in data) {
      this[field] = data[field];
    }

    this.errors = new Errors();
    this._processing = false;
    this._headers = headers;
  }

  /**
   * Make GET request
   *
   * @param {string} url
   * @param {string} transformers
   * @param {string} params
   * @param {string} headers
   * @param {function} successCallback
   * @param {function} errorCallback
   * @returns {Form}
   */
  get(url, transformers = {}, params = {}, headers = {}, successCallback = null, errorCallback = null) {
    this._request('get', url, {params, headers}).then(data => {
      for (let field in data) {
        this[field] = data[field];
      }

      this.applyTransformers(transformers, data);

      if (successCallback) {
        successCallback(data);
      }
    }).catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });

    return this;
  }

  /**
   *
   * @param {object} transformers
   * @param {object} data
   */
  applyTransformers(transformers, data) {
    for (let prop in transformers) {
      if (!data.hasOwnProperty(prop)) {
        continue;
      }

      let {field, property, func} = transformers[prop],
        tData = data[prop];

      if (!field) {
        field = prop;
      }

      if (!property && !func) {
        continue;
      }

      if (!Array.isArray(tData)) {
        this[field] = this.originalData[field] = func ? func(tData) : tData[property];
        continue;
      }

      this[field] = this.originalData[field] = tData.map(item => (func ? func(item) : item[property]));
    }
  }

  /**
   * Reset the form fields
   */
  reset() {
    for (let field in this.originalData) {
      this[field] = '';
    }

    this.errors.clear();
  }

  /**
   * Return form data
   *
   * @returns {object}
   */
  _data() {
    let data = {};

    for (let property in this.originalData) {
      data[property] = this[property];
    }

    return data;
  }

  /**
   * Make POST request
   *
   * @param {string} url
   * @param {object} headers
   * @returns {Promise<any>}
   */
  post(url, headers = {}) {
    return this._request('post', url, {headers});
  }

  /**
   * Make PUT request
   *
   * @param {string} url
   * @param {object} headers
   * @returns {Promise<any>}
   */
  put(url, headers = {}) {
    return this._request('put', url, {headers});
  }

  /**
   * Make PATCH request
   *
   * @param {string} url
   * @param {object} headers
   * @returns {Promise<any>}
   */
  patch(url, headers = {}) {
    return this._request('patch', url, {headers});
  }

  /**
   * Make DELETE request
   *
   * @param {string} url
   * @param {object} headers
   * @returns {Promise<any>}
   */
  delete(url, headers = {}) {
    return this._request('delete', url, {headers});
  }

  /**
   *
   * @param {string} url
   * @param {object} data
   * @param {object} options
   * @returns {*[]}
   */
  _transformData(url, data, options) {
    const headers = options.headers;

    if (!headers || !headers.hasOwnProperty('Content-Type') || (headers['Content-Type'] !== 'multipart/form-data')) {
      return [...arguments];
    }

    let formData = new FormData();
    for (let property in data) {
      if (!Array.isArray(data[property])) {
        formData.append(property, data[property]);

        continue;
      }

      for (let i = 0; i < data[property].length; i++) {
        formData.append(property + '[]', data[property][i]);
      }
    }

    return [url, formData, options]
  }

  /**
   * Submit request to the server
   *
   * @param {string} requestType
   * @param {string} url
   * @param {object} config
   * @returns {Promise<any>}
   */
  _request(requestType, url, config = {}) {
    let requestData = [url];
    if (['post', 'put', 'patch'].indexOf(requestType) !== -1) {
      requestData.push(this._data());
    }

    let {headers = {}, ...options} = config;
    options.headers = {
      ...this._headers,
      ...headers,
    };

    requestData.push(options);
    if (['post', 'put', 'patch'].indexOf(requestType) !== -1) {
      requestData = this._transformData(...requestData);
    }

    this._processing = true;
    return new Promise((resolve, reject) => {
      axios[requestType](...requestData)
        .then(this._requestSuccessHandler.bind(this, resolve))
        .catch(this._requestErrorHandler.bind(this, reject));
    });
  }

  /**
   * @param {function} resolve
   * @param {object} response
   */
  _requestSuccessHandler(resolve, response) {
    this._onSuccess(response.data);

    resolve(response.data);
    this._processing = false;
  }

  /**
   * @param {function} reject
   * @param {object} error
   */
  _requestErrorHandler(reject, error) {
    const response = error.response,
      errorsKey = window._vueFormPluginConfig.validationMessagesResponseKey;

    let validationErrorCodes = window._vueFormPluginConfig.validationErrorStatusCodes;
    if (!Array.isArray(validationErrorCodes)) {
      validationErrorCodes = [validationErrorCodes];
    }

    if(validationErrorCodes.indexOf(response.status) !== -1) {
      let errors = errorsKey ? response.data[errorsKey] : response.data;

      this._onFail(errors);
    }

    reject(response);
    this._processing = false;
  }

  /**
   * Set data to form instance
   *
   * @param {string} field
   * @param {object|null} event
   * @param {object|null} value
   * @param {function|null} callback
   */
  setFileField(field, event = null, value = null, callback = null) {
    //Function was called manually
    if (!event) {
      Vue.set(this, field, value);

      return;
    }

    let targetNode = event.target;
    if(targetNode.type !== 'file') {
      return;
    }

    if (targetNode.multiple) {
      Vue.set(this, field, Array.from(targetNode.files));
    } else {
      Vue.set(this, field, targetNode.files[0]);
    }

    if (callback) {
      callback(field, event);
    }
  }

  /**
   * Success callback
   */
  _onSuccess() {
    this.errors.clear();
  }

  /**
   * Error callback
   */
  _onFail(errors) {
    this.errors._record(errors);
  }
}