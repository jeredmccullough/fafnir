import {htmlElements} from 'scripts/constants';
import {Component} from 'component.class';

export const componentConstructor = config => {
  config = _.isString(config) ? JSON.parse(config) : config;
  return class TempClass extends Component {
    init(vNode) {
      super.init(vNode);
      this.$$component = this.$$component === 'TempClass' ? config.name : this.$$component;
      this.template = config.template;
    }
  };
};

let query;
export const classes = _(htmlElements)
  .map(template => {
    const name = template.replace(/\b[a-z]/g, f => f.toUpperCase());
    return [
      name,
      componentConstructor({template, name})
    ];
  })
  .tap(classList => _.each(classList, ([name, comp]) => comp.register(name)))
  .fromPairs()
  .value();

classes.A = class A extends classes.A {
  init() {
    super.init();
    this.$$options.href = '';
    this.$$options.onClick = _.noop;
    this.on('click', this.onclick.bind(this));
  }

  onclick(e) {
    this.onClick()(e);
    const newLocation = this.href();
    query = window.location.search || query || '';
    if (newLocation) {
      if (newLocation[0] === '#') {
        window.location.assign(newLocation);
      } else {
        window.location.assign(`${newLocation}${query}`);
      }
    }
  }
};

export default _.transform(classes,
  (result, element, key) => {result[key.toLowerCase()] = (...args) => new element(...args);}, {}
);
