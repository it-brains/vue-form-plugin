/**
 *
 *
 */
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
};


export default {
  get(customConfig) {
    return {
      ...config,
      ...customConfig
    }
  }
}