import Form from '../src/Form';
import Errors from '../src/Errors';
import expect from 'expect';
import moxios from 'moxios';
import axios from 'axios';

describe('Form', () => {
  let formData;
  const headers = {
    'Accept-Charset': 'Accept-Charset: utf-8',
    'Cache-Control': 'Cache-Control: no-cache',
  };

  let form;

  beforeEach(() => {
    moxios.install();

    formData = {
      name: 'John Doe',
      address: '123 Avenue',
      city: 'New York',
      state: 'NY',
      age: 30,
    };

    form = new Form(formData, headers);
  });

  afterEach(() => {
    moxios.uninstall();
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

  it('clears validation errors within success callback', () => {
    form.errors.record({
      field1: 'Error1',
      field2: 'Error2'
    });

    expect(form.errors.any()).toBe(true);

    form.onSuccess();
    expect(form.errors.any()).toBe(false);
  });

  it('records validation errors within onFail callback', () => {
    const errors = {
      filed1: 'Error1',
      filed2: 'Error2'
    }

    expect(form.errors.any()).toBe(false);

    form.onFail(errors);
    for(let property in errors) {
      expect(form.errors.get(property)).toBe(errors[property]);
    }
  });

  it('can send post request', (done) => {
    moxios.stubRequest('/users', {
      status: 200,
    });


    moxios.wait(() => {
      //TODO: test
      done();
    });

    form.post('/users');
  });

  it.only('can send get request', (done) => {
    let userData = {
      id: 1,
      name: 'John Connor',
      address: '321 Avenue',
      city: 'Los Angeles',
      state: 'CA',
      age: 31,
    };

    moxiosStubRequest('/user', 200, userData);
    form.get('/user');

    moxios.wait(() => {
      for(let property in userData) {
        expect(form[property]).toBe(userData[property]);
      }

      done();
    });

  });

  let moxiosStubRequest = (url, status, data) => {
    moxios.stubRequest('/user', {
      status: 200,
      response: data
    });
  }

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
});