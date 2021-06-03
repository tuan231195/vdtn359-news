import { format, parse } from 'date-fns';

export function toCron(date: Date) {
	return `cron(${date.getUTCMinutes()} ${date.getUTCHours()} ${date.getUTCDate()} ${
		date.getUTCMonth() + 1
	} ? ${date.getUTCFullYear()})`;
}

export function toISO(date: Date) {
	return format(date, 'yyyy-MM-dd');
}

export function fromISO(date: string) {
	return parse(date, 'yyyy-MM-dd', new Date());
}
