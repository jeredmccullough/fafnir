/*****************************************
/* DOM touch support module
/*****************************************/
if (!window.CustomEvent) {
  window.CustomEvent = function(event, params) {
    params = params || {bubbles: false, cancelable: false, detail: undefined};
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };
  window.CustomEvent.prototype = window.Event.prototype;
}

(function(document) {
  const TAPTRESHOLD = 200; // time within a double tap should have happend
  const TAPPRECISION = 60 / 2; // distance to identify a swipe gesture
  let touch = { };
  let tapCount = 0; // counts the number of touchstart events
  let tapTimer = 0; // timer to detect double tap
  let isTouchSwipe = false; // set to true whenever
  const absolute = Math.abs;
  const touchSupported = 'ontouchstart' in window;

  function parentIfText(node) {

    return 'tagName' in node ? node : node.parentNode;
  }

  function dispatchEvent(type, newtouch = touch) {
    if (touchSupported) {
      touch.originalEvent.preventDefault();
      touch.originalEvent.stopImmediatePropagation();
    }
    const event = new CustomEvent(type, {
      detail: touch,
      bubbles: true,
      cancelable: true
    });
    newtouch.target.dispatchEvent(event);

    touch = { };
    tapCount = 0;

    return event;
  }

  function touchStart(e) {
    if (!touchSupported || e.touches.length === 1) {
      const coords = e.targetTouches ? e.targetTouches[0] : e;
      touch = {
        originalEvent: e,
        target: parentIfText(e.target),
        x1: coords.pageX,
        y1: coords.pageY,
        x2: coords.pageX,
        y2: coords.pageY
      };
      isTouchSwipe = false;
      tapCount++;
      if (!e.button || e.button === 1) {
        clearTimeout(tapTimer);
        tapTimer = setTimeout(function() {
          if (absolute(touch.x2 - touch.x1) < TAPPRECISION &&
                       absolute(touch.y2 - touch.y2) < TAPPRECISION &&
                       !isTouchSwipe) {
            dispatchEvent(tapCount === 2 ? 'dbltap' : 'tap', touch);
            clearTimeout(tapTimer);
          }
          tapCount = 0;
        }, TAPTRESHOLD);
      }
    }
  }

  function touchMove(e) {
    const coords = e.changedTouches ? e.changedTouches[0] : e;
    isTouchSwipe = true;
    touch.x2 = coords.pageX;
    touch.y2 = coords.pageY;
        /* the following is obsolete since at least chrome handles this
        // if movement is detected within 200ms from start, preventDefault to preserve browser scroll etc.
        // if (touch.target &&
        //         (absolute(touch.y2 - touch.y1) <= TAPPRECISION ||
        //          absolute(touch.x2 - touch.x1) <= TAPPRECISION)
        //     ) {
        //         e.preventDefault();
        //         touchCancel(e);
        // }
        */
  }

  function touchCancel(/*event*/) {
    touch = {};
    tapCount = 0;
    isTouchSwipe = false;
  }

  function touchEnd(/*event*/) {
    const distX = touch.x2 - touch.x1;
    const distY = touch.y2 - touch.y1;
    const absX  = absolute(distX);
    const absY  = absolute(distY);
        // use setTimeout here to register swipe over tap correctly,
        // otherwise a tap would be fired immediatly after a swipe
    setTimeout(function() {
      isTouchSwipe = false;
    }, 0);
        // if there was swipe movement, resolve the direction of swipe
    if (absX || absY) {
      if (absX > absY) {
        dispatchEvent(distX < 0 ? 'swipeleft' : 'swiperight', touch);
      } else {
        dispatchEvent(distY < 0 ? 'swipeup' : 'swipedown', touch);
      }
    }
  }

  document.addEventListener(touchSupported ? 'touchstart' : 'mousedown', touchStart, false);
  document.addEventListener(touchSupported ? 'touchmove' : 'mousemove', touchMove, false);
  document.addEventListener(touchSupported ? 'touchend' : 'mouseup', touchEnd, false);
    // on touch devices, the taphold complies with contextmenu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    dispatchEvent('taphold', {
      originalEvent: e,
      target: parentIfText(e.target)
    });
  }, false);

  if (touchSupported) {
    document.addEventListener('touchcancel', touchCancel, false);
  }

}(window.document));

m.touchHelper = function(options) {
  return function(element, initialized, context) {
    if (!initialized) {
      Object.keys(options).forEach(function(touchType) {
        element.addEventListener(touchType, options[touchType], false);
      });
      context.onunload = function() {
        Object.keys(options).forEach(function(touchType) {
          element.removeEventListener(touchType, options[touchType], false);
        });
      };
    }
  };
};
// m('div', { config: m.touchHelper({ 'swipeleft': vm.selectNext, 'swiperight': vm.selectPrev}, [...])
