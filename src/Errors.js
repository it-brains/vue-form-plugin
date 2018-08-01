import Vue from 'vue';

export default class Errors {
  /**
   * Class contstructor
   */
  constructor() {
    this.errors = {};
  }

  /**
   * Determine if errors exist for given field
   *
   * @param {string} field
   */
  has(field) {
    return this.errors.hasOwnProperty(field);
  }

  /**
   * Determine if there are any errors
   */
  any() {
    return Object.keys(this.errors).length > 0;
  }

  /**
   * Get the first error message by given field
   *
   * @param {string} field
   */
  get(field) {
    if (!this.errors[field]) {
      return null;
    }

    if (Array.isArray(this.errors[field])) {
      return this.errors[field][0];
    }

    return this.errors[field];
  }

  /**
   * Record given errors
   *
   * @param {object} errors
   */
  _record(errors) {
    this.errors = errors;
  }

  /**
   * Clear all errors or errors by given field
   *
   * @param field
   */
  clear(field = null) {
    if (field) {
      Vue.delete(this.errors, field);

      return;
    }

    this.errors = {};
  }
}