import { parse } from 'date-fns';

export function isValidDate(date) {
	return date && date instanceof Date && !isNaN(date.getTime());
}

export function isDateInFormat(dateString, format) {
	if (!(dateString.length === format.length)) {
		return false;
	}
	const date = parse(dateString, format, new Date());
	return isValidDate(date);
}
