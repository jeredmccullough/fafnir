export default {
  windowEventType: _.template('Attempted to register a ${typeof event} to the window.${type} event'),
  badVar: _.template('${name} is not available in ${component}'),
  componentError: _.template('Draconis Error\ncomponent-name: ${name}\nid: ${id}\nmessage: ${message}')
};
