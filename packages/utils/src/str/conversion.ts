export function ucfirst(str) {
	if (!str) {
		return '';
	}
	str = str.toLowerCase();
	return str.charAt(0).toUpperCase() + str.substr(1);
}
