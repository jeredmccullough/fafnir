import './template.scss';
import {classes} from 'html-components';
import ampStore from 'amp-storage';
const {Div} = classes;
export class Template extends Div {
  init() {
    super.init();
    this.$$options.transclude = '';
    this.$$options.model = '';
  }
  children(vNode) {
    super.children(vNode);
    const model = ampStore.get(this.model(), '');
    const newString = _.template(this.transclude());
    this.$$children = m.trust(newString({model}));
  }
}

export default Template.register('template');
