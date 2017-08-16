export const USER_AGENT = navigator.userAgent || navigator.vendor || window.opera;
export const QUERY_STRING = window.location.search || '';
export const DEVICE_TYPES = {mobile: 'mobile', desktop: 'desktop'};
// eslint-disable-next-line max-len
export const isMobile = () => DEVICE_TYPE ? DEVICE_TYPE === DEVICE_TYPES.mobile : /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(USER_AGENT) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(USER_AGENT.substr(0, 4));
export const DEVICE_TYPE = isMobile() ? DEVICE_TYPES.mobile : DEVICE_TYPES.desktop;
export const COMMON_ASPECT_RATIOS = {916: 9 / 16, 34: 3 / 4, 43: 4 / 3, 1610: 16 / 10, 169: 16 / 9};
export const EXACT_ASPECT_RATIO = window.innerHeight / window.innerWidth;
const RATIO_KEY_PAIR = _(COMMON_ASPECT_RATIOS)
  .toPairs()
  .orderBy(([, ratio]) => Math.abs(EXACT_ASPECT_RATIO - ratio), 'asc')
  .head();

export const ASPECT_RATIO = RATIO_KEY_PAIR[0];
export const ASPECT_RATIO_VALUE = RATIO_KEY_PAIR[1];

export const UTM = {
  campaign: 'utm_campaign',
  content: 'utm_content',
  id: 'utm_id',
  medium: 'utm_medium',
  params: 'utm_params_mystique',
  source: 'utm_source',
  variant: 'utm_variant',
  funnelStep: 'utm_funnel_step',
  url: 'hard_url'
};
export const SOURCE_WHITELIST = ['ampush', 'insiderenvy'];
export const MEDIUM_WHITELIST = ['prospecting', 'retargeting', 'insiderenvy', 'test', 'taboolaoutbrain', 'TaboolaOutbrain', 'other'];
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
export const API_URL = 'https://ampid.ampush.io/translate';
export const WHITELISTED_UTM = {
  [UTM.source]: true,
  [UTM.medium]: true,
  [UTM.campaign]: true,
  [UTM.content]: true,
  [UTM.variant]: true,
  [UTM.funnelStep]: true,
  [UTM.url]: true
};

// export const DEFAULT_UTM_TOKEN = '68ba126472fa2d9a8bb75a848dbd29cd';
export const DEFAULT_UTM_CAMPAIGN_ID = '111111222222';

// eslint-disable-next-line
const RFC822 = new RegExp(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/);
export const VALID_EMAIL = RFC822;
export const HTML_METHODS = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE'
};

export const htmlElements  = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b',
  'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
  'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details',
  'dfn', 'div', 'dl', 'doctype', 'dt', 'em', 'embed', 'fieldset', 'figcaption',
  'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header',
  'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label',
  'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav',
  'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre',
  'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select',
  'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table',
  'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track',
  'u', 'ul', 'var', 'video', 'wbr'];

export const BREAKPOINTS = {
  xxxs: 350,
  xxs: 500,
  xs: 665,
  small: 767,
  medium: 992,
  large: 1200,
  xl: 1400
};

export const ORIENTATIONS = {90: 'portrait', '-90': 'portrait',  0: 'landscape', 180: 'landscape'};
export const AMP_ID_REGEX = /^amp_/;
export const AMP_STORE_PREFIX = window.__AMP_STORE_PREFIX__ || '7fh285_';
