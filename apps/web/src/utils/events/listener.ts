export function onScrollOnce(listener) {
	function eventListener() {
		listener();
		window.removeEventListener('scroll', eventListener);
	}
	window.addEventListener('scroll', eventListener);
}

export function onResizeOne(listener) {
	function eventListener() {
		listener();
		window.addEventListener('resize', eventListener);
	}
	window.addEventListener('resize', eventListener);
}
