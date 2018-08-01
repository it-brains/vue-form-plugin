import Form from '../src/Form';
import Errors from '../src/Errors';
import expect from 'expect';

describe('Form', () => {
  const formData = {
    name: 'John Doe',
    address: '123 Avenue',
    city: 'New York',
    state: 'NY',
    age: 30,
  };
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept-Charset': 'Accept-Charset: utf-8',
    'Cache-Control': 'Cache-Control: no-cache',
  };

  let form;

  beforeEach(() => {
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

  //TODO: get request
  //TODO: reset
  //TODO: data
  //TODO: post request
  //TODO: PUT request
  //TODO: PATCH request
  //TODO: delete request
  //TODO: setFileField
});