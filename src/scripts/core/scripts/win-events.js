import ERRORS from './errors';

class WindowEvent {
  constructor(events = {}) {
    _.assign(this, {events});
  }

  register(type, event) {
    if (!event[type]) {
      this.events[type] = [];
      window.addEventListener(type, this.eventListener(type));
    }
    if (_.isFunction(event)) {
      this.events[type].push(event);
      this.events[type] = _.uniq(this.events[type]);
    } else {
      throw new Error(ERRORS.windowEventType({event, type}));
    }
  }

  deregister(type, event) {
    const eventList = _.get(this.events[type]);
    if (!_.isEmpty(eventList)) {
      this.events[type] = eventList.filter(tempEvent => tempEvent !== event);
    }
  }

  eventListener(type) {
    return e => _.each(this.events[type], fn => fn(e));
  }
}

export default new WindowEvent();
