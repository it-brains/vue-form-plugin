import config from '../src/config';
import expect from 'expect';

describe('config', () => {
  let defaultValues = {
    formClassName: 'Form',
    validationMessageComponentName: 'validation-message',
    formDirectiveName: 'form',
    clearValidationMessageWithInputChange: true,
    validationMessagesResponseKey: '',
    validationErrorStatusCodes: 422,
    commonHttpHeaders: {}
  };

  it('returns correct default values', () => {
    expect(config.get()).toEqual(defaultValues);

    expect(config.get({})).toEqual(defaultValues);
  });

  it('returns merged config', () => {
    let customConfig = {
      config1: 1,
      formClassName: 'Form2',
      validationMessageComponentName: 'validation-message-comp',
      formDirectiveName: 'test',
      clearValidationMessageWithInputChange: false,
      validationMessagesResponseKey: 'errors',
      validationErrorStatusCodes: [500, 422],
    };

    expect(config.get(customConfig)).toEqual({
      ...defaultValues,
      ...customConfig
    });
  });
});