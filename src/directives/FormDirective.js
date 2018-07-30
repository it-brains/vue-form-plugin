/**
 * Change input event handler
 *
 * @param {object} form
 * @param event
 */
function clearValidationErrorAfterChangeInput(form, event) {
  if (!event.target.name) return;

  form.errors.clear(event.target.name);
}

/**
 * Inject errors object into validation message directives
 *
 * @param {object} Vue
 * @param {string} componentName
 * @param {object} vnode
 * @param {object} errors
 */
function injectErrorsObjectIntoComponent(Vue, componentName, vnode, errors) {
  if (vnode.hasOwnProperty('$vnode')) {
    vnode = vnode.$vnode;
  }

  if (!vnode.tag) {
    return;
  }

  //Inject errors object into validation directive
  if (vnode.componentOptions && (vnode.componentOptions.tag === componentName)) {
    Vue.set(vnode.componentInstance.$data, 'injectedErrors', errors);

    return;
  }

  let children = vnode.componentInstance ? vnode.componentInstance.$children : vnode.children;
  if (!children) {
    return;
  }

  children.map(child => {
    injectErrorsObjectIntoComponent(Vue, componentName, child, errors);
  });
}

export default {
  register(Vue, config) {
    let directiveName = config.formDirectiveName;

    Vue.directive(directiveName, {
      inserted(el, bindings, vnode) {
        const form = bindings.value;
        if (!form) return;

        if (config.clearValidationMessageWithInputChange) {
          el.addEventListener('keydown', clearValidationErrorAfterChangeInput.bind(null, form));
          el.addEventListener('change', clearValidationErrorAfterChangeInput.bind(null, form));
        }

        vnode.children.forEach(child => {
          injectErrorsObjectIntoComponent(Vue, config.validationMessageComponentName, child, form.errors);
        });
      }
    });
  },

}
