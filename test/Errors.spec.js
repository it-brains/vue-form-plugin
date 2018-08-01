import Errors from '../src/Errors';
import expect from 'expect';

describe('Errors', () => {
  let errorsInstance;
  beforeEach(() => {
    errorsInstance = new Errors();
  });

  it('sets empty object as errors property of class instance within constructor', () => {
    expect(errorsInstance.errors).toEqual({});
  });

  it('can determine if it has errors by given field name', () => {
    expect(errorsInstance.has('field_name')).toBe(false);

    errorsInstance.errors.field_name = 'Some error message';
    expect(errorsInstance.has('field_name')).toBe(true);
  });

  it('can determine if it has any errors', () => {
    expect(errorsInstance.any()).toBe(false);

    errorsInstance.errors.field_name = 'Some error';
    errorsInstance.errors.one_more_field_name = 'Some error2';
    expect(errorsInstance.any()).toBe(true);

    errorsInstance.errors = {};
    expect(errorsInstance.any()).toBe(false);
  });

  it('returns null if there is no error by given field name', () => {
    expect(errorsInstance.get('field_name')).toBe(null);
  });

  it('returns error by given field name', () => {
    errorsInstance.errors.field_name = 'Error message';

    expect(errorsInstance.get('field_name')).toBe(errorsInstance.errors.field_name);
  });

  it('returns first error by given field name if there are several errors for this field name', () => {
    errorsInstance.errors.field_name = ['error1', 'error2', 'error3'];

    expect(errorsInstance.get('field_name')).toBe(errorsInstance.errors.field_name[0]);
  });

  it('clears all errors if field name was not passed', () => {
    errorsInstance.errors = {
      field1: 'Error1',
      field2: ['Error', 'Error2']
    };

    errorsInstance.clear();
    expect(errorsInstance.errors).toEqual({});
  });

  it('clears error by given field name', () => {
    let errors =  {
      field1: 'Error1',
      field2: ['Error', 'Error2']
    };


    let newErrors = {
      field2: errors.field2
    };

    errorsInstance.errors = errors;

    errorsInstance.clear('field1');
    expect(errorsInstance.errors).toEqual(newErrors);
  });
});