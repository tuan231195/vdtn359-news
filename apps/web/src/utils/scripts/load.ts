export function loadScript(src) {
	const tag = document.createElement('script');
	tag.async = false;
	tag.src = src;
	document.body.appendChild(tag);
}

export function loadStyle(src) {
	const css = document.createElement('link');
	css.href = src;
	css.rel = 'stylesheet';
	css.type = 'text/css';
	document.getElementsByTagName('head')[0].appendChild(css);
}
