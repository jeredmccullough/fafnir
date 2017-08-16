import {classes} from 'html-components';
const {Img} = classes;
const _Image = window.Image;

export class Image extends Img {
  init() {
    super.init();
    this.$$options.active = '';
    this.$$options.lazy = '';
    this.changeImage = this.changeImage.bind(this);
    this.onLoad = this.onLoad.bind(this);

    this.on('active', $event => {
      if ($event.value !== this.imageLoader.src) {
        this.changeImage($event.value);
      }
    });
  }

  getLoader() {
    if (!this.imageLoader) {
      this.imageLoader = new _Image();
      this.imageLoader.onload = this.onLoad;
    }
    return this.imageLoader;
  }

  changeImage() {
    document.removeEventListener('readystatechange', this.changeImage);
    if (document.readyState === 'complete') {
      const loader = this.getLoader();
      const src = _.invoke(this, 'lazy');
      _.isString(src) && !_.isEqual(loader.src, src) && _.set(loader, 'src', src);
    } else {
      document.addEventListener('readystatechange', this.changeImage);
    }
  }

  onLoad() {
    this.active(_.get(this.imageLoader, 'src', ''));
    m.redraw();
  }

  options(vNode) {
    super.options(vNode);
    this.changeImage(_.invoke(this, 'lazy'));
  }

  props(vNode) {
    super.props(vNode);
    const src = _.invoke(this, 'active');
    src && _.set(vNode, 'props.src', src);
  }
}

export default Image.register('Image');
