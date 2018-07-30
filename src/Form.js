import Errors from './Errors';
import axios from 'axios'

export default class Form {

  /**
   * Class constructor
   *
   * @param {object} data
   */
  constructor(data) {
    this.originalData = data;

    for (let field in data) {
      this[field] = data[field];
    }

    this.errors = new Errors();
    this._processing = false;
  }

  /**
   * Make GET request
   *
   * @param {string} url
   * @param {function} successCallback
   * @param {function} errorCallback
   * @returns {Form}
   */
  get(url, successCallback, errorCallback) {
    this.submit('get', url).then(data => {
      for (let field in data) {
        this[field] = data[field];
      }

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
  data() {
    let data = {};

    for (let property in this.originalData) {
      data[property] = this[property];
    }

    return data;
  }

  /**
   * Make POST request
   *
   * @param {string }url
   * @returns {*}
   */
  post(url) {
    return this.submit('post', url);
  }

  /**
   * Make PUT request
   *
   * @param {string} url
   * @returns {*}
   */
  put(url) {
    return this.submit('put', url);
  }

  /**
   * Make PATCH request
   *
   * @param {string} url
   * @returns {*}
   */
  patch(url) {
    return this.submit('patch', url);
  }

  /**
   * Make DELETE request
   *
   * @param {string} url
   * @returns {*}
   */
  delete(url) {
    return this.submit('delete', url);
  }

  /**
   * Submit request to the server
   *
   * @param requestType
   * @param url
   * @returns {Promise<any>}
   */
  submit(requestType, url) {
    this._processing = true;

    return new Promise((resolve, reject) => {
      axios[requestType](url, this.data())
        .then(response => {
          this.onSuccess(response.data);

          resolve(response.data);
          this._processing = false;
        })
        .catch(error => {
          if(error.response.status === 422) {
            this.onFail(error.response.data.errors);
          }

          reject(error.response);
          this._processing = false;
        });
    });
  }

  /**
   * Success callback
   */
  onSuccess() {
    this.errors.clear();
  }

  /**
   * Error callback
   */
  onFail(errors) {
    this.errors.record(errors);
  }
}