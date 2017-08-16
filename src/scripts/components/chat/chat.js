const url = 'https://w.chatlio.com/w.chatlio-widget.js';
const widget = document.createElement('script');

widget.id = 'chatlio-widget-embed';
widget.src = url;
widget.async = true;
widget.setAttribute('data-embed-version', '2.1');
widget.setAttribute('data-widget-options', `{"embedSidebar": ${window.innerWidth < 768}}`);

export default (id) => {
	widget.setAttribute('data-widget-id', id);
	
	window._chatlio = window._chatlio = [];
	_.each(['configure', 'identify', 'track', 'show', 'hide', 'isShown', 'isOnline'], key => {
	  window._chatlio[key] = _.partial(window._chatlio.push, key);
	});

	// chatlio documentation
	// document.addEventListener('chatlio.firstMessageSent', function(event) {
	//   console.log('[chatlio.firstMessageSent] event: %o', event); // Do something interesting
	// });
	// document.addEventListener('chatlio.messageReceived', function(event) {
	//   console.log('[chatlio.messageReceived] event: %o', event); // Do something interesting
	// });
	document.addEventListener('chatlio.expanded', () => window._chatlio
	  .identify(window.ampt.uid[0] === '1' ? window.ampt.uid : '1' + window.ampt.uid));

	document.head.appendChild(widget);
};

// 64689f25-6005-46a1-6607-cc209ce212b3