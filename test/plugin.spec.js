import expect from 'expect';
import { mount, createLocalVue } from 'vue-test-utils';
import moxios from 'moxios';
import config from '../src/config';
import DevDemo from './../demos/dev/src/DevApp.vue';
import plugin from './../dist';


describe('plugin', () => {
  let wrapper;

  beforeEach(() => {
    let localVue = createLocalVue();
    localVue.use(plugin);
    global.Form = window.Form;

    wrapper = mount(DevDemo, {localVue});
  });


  it('can ...', () => {
    expect(true).toBe(true);
  });

  ///Helpers
  let see = (text, selector) => {
    let wrap = selector ? wrapper.find(selector) : wrapper;

    expect(wrap.html()).toContain(text);
  };

  let type = (selector, text) => {
    let node = wrapper.find(selector);

    node.element.value = text;
    node.trigger('input');
  };
});