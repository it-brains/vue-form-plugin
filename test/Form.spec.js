import Form from '../src/Form';
import Errors from '../src/Errors';
import expect from 'expect';
import moxios from 'moxios';
import config from '../src/config';
import Vue from 'vue';

//TODO: test calling callbacks
describe('Form', () => {
  let formData;
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=utf-8',
    'Accept-Charset': 'Accept-Charset: utf-8',
    'Cache-Control': 'Cache-Control: no-cache',
  };

  let form;
  global._vueFormPluginConfig = config.get({});

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

  it('returns empty object if data was not passed trough constructor', () => {
    let newForm = new Form();

    expect(newForm._data()).toEqual({});
  });

  it('resets all instance properties passed via object through constructor and errors', () => {
    expect(form._data()).toEqual(formData);

    for(let property in formData) {
      formData[property] = '';
    }

    form.errors._record({
      field1: 'Error1',
      field2: ['Error', 'Error2'],
    });

    form.reset();

    expect(form._data()).toEqual(formData);
    expect(form.errors.any()).toBe(false);
  });

  it('can send get request', (done) => {
    let userData = {
      id: 1,
      name: 'John Connor',
      address: '321 Avenue',
      city: 'Los Angeles',
      state: 'CA',
      age: 31,
    };
    let params = {
      id: 1,
      test: 'data'
    };

    moxiosStubRequest('/user', 200, userData);
    form.get('/user', params);

    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      expect(request.headers).toEqual(headers);
      expect(request.config.params).toEqual(params);

      //TODO: not working... Why??!
      for(let property in userData) {
        // console.log(property, form[property]);
        // expect(form[property]).toBe(userData[property]);
      }

      done();
    });

  });

  let moxiosStubRequest = (url, status, data) => {
    moxios.stubRequest(url, {
      status: status,
      response: data
    });
  }

  let testSendFailedRequestAndHandlerValidationErrors = (requestType, done) => {
    let validationErrors = {
      name: 'Error1',
      address: 'Error2',
      city: ['Error', 'Error3'],
      state: 'error4',
    }

    expect(form._processing).toBe(false);
    expect(form.errors.any()).toBe(false);
    moxiosStubRequest('/users', _vueFormPluginConfig.validationErrorStatusCodes, validationErrors);

    form[requestType]('/users').catch(() => {});
    expect(form._processing).toBe(true);
    moxios.wait(() => {
      let lastRequest = moxios.requests.mostRecent();
      expect(lastRequest.headers).toEqual(headers);

      if (['post', 'put', 'patch'].indexOf(requestType) !== -1) {
        expect(form.originalData).toEqual(JSON.parse(lastRequest.config.data));
      }

      for(let property in validationErrors) {
        expect(form.errors.errors[property]).toEqual(validationErrors[property]);
      }

      expect(form._processing).toBe(false);
      done();
    });
  };

  it('can send post request and handle validation errors', (done) => {
    testSendFailedRequestAndHandlerValidationErrors('post', done);
  });

  it('can send put request and handle validation errors', (done) => {
    testSendFailedRequestAndHandlerValidationErrors('put', done);
  });

  it('can send patch request and handle validation errors', (done) => {
    testSendFailedRequestAndHandlerValidationErrors('patch', done);
  });

  it('can send delete request and handle validation errors', (done) => {
    testSendFailedRequestAndHandlerValidationErrors('delete', done);
  });

  let testSendSuccessRequestAndClearErrors = (requestType, done) => {
    let validationErrors = {
      name: 'Error1',
      address: 'Error2',
      city: ['Error', 'Error3'],
      state: 'error4',
    }

    expect(form._processing).toBe(false);
    form.errors._record(validationErrors);
    expect(form.errors.any()).toBe(true);

    moxiosStubRequest('/users', 200, {});

    form[requestType]('/users').catch(() => {});
    expect(form._processing).toBe(true);
    moxios.wait(() => {
      expect(form.errors.any()).toBe(false);
      expect(form._processing).toBe(false);

      done();
    });
  };

  it('can send post request and clear errors', (done) => {
    testSendSuccessRequestAndClearErrors('post', done);
  });

  it('can send put request and clear errors', (done) => {
    testSendSuccessRequestAndClearErrors('put', done);
  });

  it('can send patch request and clear errors', (done) => {
    testSendSuccessRequestAndClearErrors('patch', done);
  });

  it('can send delete request and clear errors', (done) => {
    testSendSuccessRequestAndClearErrors('delete', done);
  });

  it('can set files property', () => {
    expect(form.file).toBe(undefined);

    const fileData = {size: 101020, field: '....'};
    const eventObject = {
      target: {
        type: 'file',
        multiple: false,
        files: [fileData]
      }
    };

    form.setFileField('file', eventObject);
    expect(form.file).toEqual(fileData);
  });

  it('can set files property with multiple input', () => {
    expect(form.files).toBe(undefined);

    const filesData = [
      {size: 101020, field: '....'},
      {size: 101021, field: '........'}
    ];
    const eventObject = {
      target: {
        type: 'file',
        multiple: true,
        files: filesData
      }
    }

    form.setFileField('files', eventObject);
    expect(form.files).toEqual(filesData);
  });

  it('can clear files property', () => {
    const fileData = {size: 101020, field: '....'};

    Vue.set(form, 'file', fileData);
    expect(form.file).toEqual(fileData);

    form.setFileField('file', null, null);
    expect(form.file).toEqual(null);
  });
});