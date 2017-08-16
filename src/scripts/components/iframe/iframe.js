import {classes} from 'html-components';
const {Iframe: oldIframe} = classes;
// const _Image = window.Image;

export class Iframe extends oldIframe {
  init() {
    super.init();
    this.$$options.lazy = '';
    this.$$options.active = '';
    this.changeSrc = this.changeSrc.bind(this);
  }

  options(vNode) {
    super.options(vNode);
    this.changeSrc();
  }

  changeSrc() {
    document.removeEventListener('readystatechange', this.changeSrc);
    if (document.readyState === 'complete') {
      const src = _.invoke(this, 'lazy');
      if (_.isString(src) && src !== _.invoke(this, 'active')) {
        this.active(src);
        m.redraw();
      }
    } else {
      document.addEventListener('readystatechange', this.changeSrc);
    }
  }

  props(vNode) {
    super.props(vNode);
    const src = _.invoke(this, 'active');
    src && _.set(vNode, 'props.src', src);
  }
}

export default Iframe.register('Iframe');
