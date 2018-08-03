import expect from 'expect';
import { mount, createLocalVue } from 'vue-test-utils';
import moxios from 'moxios';
import config from '../src/config';
import DevDemo from './../demos/dev/src/DevApp.vue';
import plugin from './../src';
import Form from "../src/Form";


describe('plugin', () => {
  let wrapper,
    localVue;

  beforeEach(() => {
    moxios.install();
    localVue = createLocalVue();
    localVue.use(plugin);
    global.Form = window.Form;

    wrapper = mount(DevDemo, {localVue});
  });

  afterEach(() => {
    moxios.uninstall();
  });


  it('can display validation errors returned from server', (done) => {
    sendFailedRequest();

    moxios.wait(() => {
      see('First name field should be at least 6 characters');
      see('The first error');

      done();
    });
  });

  it('can clear validation error after changing of appropriate input', (done) => {
    sendFailedRequest();

    moxios.wait(() => {
      see('First name field should be at least 6 characters');
      see('The first error');

      type('#first_name', 'First2');
      type('#last_name', 'Last2');
      wrapper.find('#first_name').trigger('change');
      wrapper.find('#last_name').trigger('change');


      dontSee('First name field should be at least 6 characters');
      dontSee('The first error');

      done();
    });
  });

  it('can clear validation error after successfully request', (done) => {

    wrapper.vm.form.errors.errors = {
      first_name: 'First name error',
      last_name: 'Last name error',
    };
    // see('First name error');

    //TODO
    done();
  });

  it('can inject form errors through directive', () => {
    //TODO
  });

  it('can change files property of form after changing of appropriate input', () => {
    //TODO
  });

  it('can send request with headers', () => {
    //TODO
  });

  let sendFailedRequest = () => {
    type('#first_name', 'First');
    type('#last_name', 'Last');

    stubRequest('/test', 422, {
      first_name: 'First name field should be at least 6 characters',
      last_name: ['The first error', 'Last name field should be at least 6 characters'],
    });

    click('#submitBtn');
  };

  ///Helpers
  let stubRequest = (url, status, data) => {
    moxios.stubRequest(url, {
      status: status,
      response: data
    });
  };

  let see = (text, selector) => {
    let wrap = selector ? wrapper.find(selector) : wrapper;

    expect(wrap.html()).toContain(text);
  };

  let dontSee = (text, selector) => {
    let wrap = selector ? wrapper.find(selector) : wrapper;

    expect(wrap.html()).not.toContain(text);
  };

  let click = (selector) => {
    wrapper.find(selector).trigger('click');
  };

  let type = (selector, text) => {
    let node = wrapper.find(selector);

    node.element.value = text;
    node.trigger('input');
  };
});