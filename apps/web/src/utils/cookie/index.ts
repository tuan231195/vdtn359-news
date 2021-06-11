import * as Cookies from 'js-cookie';

export const cookies = Cookies.withConverter({
	read: function (value) {
		try {
			return JSON.parse(value);
		} catch {
			return Cookies.get(value);
		}
	},
	write: function (value) {
		if (value && typeof value === 'object') {
			return JSON.stringify(value);
		}
		return value;
	},
});
