import init from 'amp.js';
import store from 'component.store';
import Ampalytics from 'core/ampalytics';
import partner from 'tmp/partner';
import events from '../data/events.json';

_.set(partner, 'events', events);
const track = new Ampalytics(partner).track;
const state = store.state;
export {init, state, track, partner};
