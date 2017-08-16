import ampStore from 'amp-storage';
import './scripts/eventlistener.polyfill';
import {generateID} from 'scripts/helper-functions';
import store from './component.store';
const blackListKeys = [
  'css',
  'style',
  'classes',
  'className',
  'classList',
  'children',
  'props'
];

// overwriting the mithril prop function to provide event handling
const draconisProp = function(propStore, eventName, component) {
  const prop = (...args) => {
    const newStore = args.length ? args[0] : propStore;
    if (newStore !== propStore && component && component.$$element) {
      let event;
      if (_.isFunction(Event)) {
        event = new Event(eventName);
      } else {
        event  = document.createEvent('Event');
        event.initEvent(eventName, true, true);
      }
      event.value = newStore;
      component.$$element.dispatchEvent(event);
    }
    propStore = newStore;
    return propStore;
  };
  return prop;
};

// helper function to create a common config object structure
const constructConfigObject = (config, children) => {
  if (_.isArray(config) || _.has(config, 'config') || !_.isObject(config)) {
    _.isFunction(config) && (config = config());
    config = {children: [config]};
  }
  config = _.has(config, 'init') ? config.init : config;
  _.set(config, 'children', _.chain(config)
    .get('children', [])
    .concat(children)
    .flattenDeep()
    .compact()
    .value()
  );
  return config;
};

export class Component {
  static register(name) {
    name && (this.$$name$$ = name);
    _.set(store, ['classes', name || this.name], this);
    _.set(store, ['components', _.lowerCase(name || this.name)], (...args) => new this(...args));
    return _.get(store, ['components', _.lowerCase(name || this.name)]);
  }

  constructor(config = {}, ...children) {
    this.config = constructConfigObject(config, children);
    this.$$global = store.state;
    this.$$key = this.config.key;
    this.$$component = this.constructor.$$name$$ || this.constructor.name || 'UNNAMED COMPONENT';
    this.$$options = {};
    this.$$state = {};
    this.$$css = this.$$style = _.merge({}, this.config.css, this.config.style);
    this.$$classes = _.castArray(this.config.classes);
    this.$$children = _.castArray(this.config.children);
    this.$$props = this.config.props || {};
    this._cleanMithrilKeys();
    this.id = this.config.id || generateID();
    this.cache = ampStore;
  }

  _cleanMithrilKeys() {
    this.onremove && (this.__onremove = this.onremove);
    this.onremove = this._onremove;
    this.oninit && (this.__oninit = this.oninit);
    this.oninit = this._oninit;
    this.oncreate && (this.__oncreate = this.oncreate);
    this.oncreate = this._oncreate;
    this.view && (this.__view = this.view);
    this.view = this._view;
  }

  _oninit(vNode) {
    this.template = this.config.template || 'div';
    this.init(vNode);
    this.__oninit(vNode);
    _.assign(this.$$state, _.get(this.$$global, [this.$$component, this.$$key], {}));
    _.each(this.$$options, (option, key) => {
      this[key] = draconisProp(this.config[key] || option, key, this);
    });
    this.state = _.mapValues(this.$$state, (option, key) => draconisProp(option, key, this));
    this.compose();
    this.$$key && _.set(this.$$components, [this.$$component, this.$$key], this);
  }

  _view(vNode) {
    this.__view(vNode);
    this._options(vNode);
    const className = this._classes(vNode);
    const children = this._children(vNode);
    const style = this._css(vNode);
    const props = this._props(vNode);
    !_.isEmpty(className) && (props.className = className);
    !_.isEmpty(style) && (props.style = style);
    return m(this.template, props, children);
  }

  _children(vNode) {
    return  _.chain(this.children(vNode) || this.$$children)
      .castArray()
      .flattenDeep()
      .compact()
      .map(child => child.tag || _.isString(child) ? child : m(child))
      .value();
  }

  _classes(vNode) {
    const classes = _.castArray(this.classes(vNode))
      .concat(_.kebabCase(`draconis-${this.$$component}`))
      .concat(vNode.classes)
      .concat(this.$$classes);
    _.unset(vNode, 'classes');
    return _.chain(classes)
      .flattenDeep()
      .uniq()
      .compact()
      .value()
      .join(' ');
  }

  _css(vNode) {
    return _.merge({},
      this.$$css,
      this.$$style,
      this.css(),
      vNode.css,
      this.style(),
      vNode.style);
  }

  _props(vNode) {
    const props = _.merge({}, this.config, this.$$props, this.props(vNode), vNode.props);
    const blackList = [].concat(blackListKeys).concat(_.keys(this.$$options));
    _.unset(vNode, 'props');
    return _.chain(props)
      .toPairs()
      .filter(([key]) => !_.includes(blackList, key))
      .fromPairs()
      .value();
  }

  _options(vNode) {
    this.options(vNode);
  }

  _oncreate(vNode) {
    this.__oncreate(vNode);
    this.$$element = vNode.dom;
    _.each(this.___listeners___, (fns, propName) => this.addEventListener(propName));
    this.postRender(vNode);
  }

  _onremove(vNode) {
    this.__onremove(vNode);
    const state = _.mapValues(this.state, val => val());
    this.$$key && !_.isEmpty(this.state) && _.set(this.$$global, [this.$$component, this.$$key], state);
  }

  clear(propName, listener) {
    const location = ['___listeners___', propName];
    listener && location.push(`${listener}`);
    _.unset(this, location);
  }

  on(propName, listener) {
    _.set(this, ['___listeners___', propName, `${listener}`], listener);
    this.$$element && addEventListener(propName);
  }

  addEventListener(propName) {
    this.$$element
      .addEventListener(propName, e => {
        _.chain(this)
          .get(['___listeners___', propName])
          .map()
          .uniq()
          .compact()
          .each(cb => cb(e, e.value, _.isFunction(this[propName]) ? this[propName]() : this[propName]))
          .value();
      }
    );
  }

  // placeholder functions
  compose() {}
  init() {}
  onbeforeremove(/*vNode*/) {}
  onbeforeupdate(/*vNode*/) {}
  onupdate(/*vNode*/) {}
  classes(/*vNode*/) {}
  options(/*vNode*/) {}
  css(/*vNode*/) {}
  style(/*vNode*/) {}
  children(/*vNode*/) {}
  props(/*vNode*/) {}
  beforeRemove() {}
  postRender(/*vNode*/) {}
  oncreate(/*vNode*/) {}
  oninit(/*vNode*/) {}
  __onremove(/*vNode*/) {}
  __oninit(/*vNode*/) {}
  __oncreate(/*vNode*/) {}
  __view(/*vNode*/) {}
}
