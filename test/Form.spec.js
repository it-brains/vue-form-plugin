import Form from '../src/Form';
import Errors from '../src/Errors';
import expect from 'expect';

describe('Form', () => {
  let formData;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept-Charset': 'Accept-Charset: utf-8',
    'Cache-Control': 'Cache-Control: no-cache',
  };

  let form;

  beforeEach(() => {
    formData = {
      name: 'John Doe',
      address: '123 Avenue',
      city: 'New York',
      state: 'NY',
      age: 30,
    };

    form = new Form(formData, headers);
  });

  describe('Constructor', () => {
    it('puts passed data object into originalData property of class instance', () => {
      expect(form.originalData).toEqual(formData);
    });

    it('puts passed data object properties with their values to an class instance', () => {
      for(let property in formData) {
        expect(form[property]).toBe(formData[property]);
      }
    });

    it('sets fresh errors property of class instance', () => {
      expect(form.errors).toEqual(new Errors());
    });

    it('sets internal _processing property to false', () => {
      expect(form._processing).toBe(false);
    });

    it('sets passed headers object into internal _headers property', () => {
      expect(form._headers).toEqual(headers);
    });

    it('sets empty object to internal _headers property if headers was not passed', () => {
      let newForm = new Form({});
      expect(newForm._headers).toEqual({});
    });
  });

  it('returns data passed trough constructor', () => {
    expect(form.data()).toEqual(formData);
  });

  it('returns empty object if data was not passed trough constructor', () => {
    let newForm = new Form();

    expect(newForm.data()).toEqual({});
  });

  it('resets all instance properties passed via object through constructor and errors', () => {
    expect(form.data()).toEqual(formData);

    for(let property in formData) {
      formData[property] = '';
    }

    form.errors.record({
      field1: 'Error1',
      field2: ['Error', 'Error2'],
    });

    form.reset();

    expect(form.data()).toEqual(formData);
    expect(form.errors.any()).toBe(false);
  });

  //TODO: get request
  //TODO: post request
  //TODO: PUT request
  //TODO: PATCH request
  //TODO: delete request
  //TODO: transformData
  //TODO: request
  //TODO: requestSuccessHandler ???
  //TODO: requestErrorHandler ???
  //TODO: setFileField
  //TODO: onSuccess
  //TODO: onFail
});