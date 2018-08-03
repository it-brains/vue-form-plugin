const config = {
  /**
   * Name of form class
   */
  formClassName: 'Form',

  /**
   * Name of validation message component
   */
  validationMessageComponentName: 'validation-message',

  /**
   * Name of form directive
   */
  formDirectiveName: 'form',

  /**
   * Clear validation message after appropriate input was changed
   */
  clearValidationMessageWithInputChange: true,

  /**
   * Key of validation messages returned from the server
   */
  validationMessagesResponseKey: '',

  /**
   * HTTP response codes of validation error
   */
  validationErrorStatusCodes: 422,

  /**
   * HTTP headers which will be used with every request
   */
  commonHttpHeaders: { },
};


export default {
  get(customConfig = {}) {
    return {
      ...config,
      ...customConfig
    }
  }
}