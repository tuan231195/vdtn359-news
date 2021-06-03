import {
	format,
	formatDistanceStrict,
	isAfter,
	isBefore,
	isEqual,
	startOfWeek,
} from 'date-fns';

export function isBeforeOrSame(date1, date2) {
	return isBefore(date1, date2) || isEqual(date1, date2);
}

export function isAfterOrSame(date1, date2) {
	return isAfter(date1, date2) || isEqual(date1, date2);
}

export function weekStart(date) {
	return startOfWeek(date, { weekStartsOn: 1 });
}

export function formatDistance(date, relativeDate) {
	if (relativeDate.getTime() - date.getTime() >= 86400 * 1000) {
		return format(date, 'dd/MM/yyyy hh:mm a');
	}
	return `${formatDistanceStrict(date, relativeDate)} ago`;
}
