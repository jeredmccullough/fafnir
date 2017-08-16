import 'classlist-polyfill';
import smoothScroll from 'smoothscroll-polyfill';
smoothScroll.polyfill();
import './font-awesome';
import store from './core/component.store';
import chat from './components/chat/chat';
import './analytics-plugins/**/*.js';
import './components/**/*.js';
window.__CHATID__ && chat(window.__CHATID__);

export default () => _.each(document.querySelectorAll('[draconis]'), tag => {
  const component = _.get(store.components, tag.getAttribute('draconis'));
  const children = _.trim(tag.innerHTML);
  const config = {wait: !!children, transclude: children};
  if (component) {
    _.transform(tag.attributes, (result, attr) => {
      const key = attr.name === 'class' ? 'classes' : attr.name;
      const val = attr.name === 'class' ? attr.nodeValue.split(' ') : attr.nodeValue;
      result[key] = val;
    }, config);
    const fakeParent = document.createElement('span');
    m.mount(fakeParent, component(config));
    const newTag = fakeParent.firstChild;
    tag.parentNode.replaceChild(newTag, tag);
  }
});

// remove fouc style block
const nofouc = document.querySelector('style.no-fouc');
nofouc.parentNode.removeChild(nofouc);
