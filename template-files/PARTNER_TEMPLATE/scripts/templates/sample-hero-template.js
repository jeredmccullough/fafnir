import '../../styles/templates/${TEMPLATE_NAME}.scss';
import {init, state, track} from '../partner';
import '../events/amp-events';
import '../events/ampush';

init();
export {state, track};
