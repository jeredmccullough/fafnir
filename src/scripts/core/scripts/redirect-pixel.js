
!function(a, m, p, t, e, d) {e = new Date(); d = e.getTime(); t = a.createElement('script'); t.type = 'text/javascript'; p = new XMLHttpRequest(); p.timeout = 500; p.ontimeout = p.onload = function() {window.__loadTime__ = e.getTime() - d; window.__variantUrl__ = this.response || ''; m = (this.response || '').replace(/\"/g, ''); m = m.slice(m.length - 6).indexOf(/\.html|\.js|\.gz/) !== -1 ? m : ''; m.indexOf('.html') !== -1 ? a.location = m : t.src = m; a.head.appendChild(t);}; p.open('GET', 'http://ampushiq-experimenter-qa-pid.us-east-1.elasticbeanstalk.com/experimenter', true); p.send(null);}(document);
