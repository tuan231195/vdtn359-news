export function range(start: number, stop?: number, step = 1) {
	if (typeof stop === 'undefined') {
		stop = start;
		start = 0;
	}

	if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
		return [];
	}

	const result: number[] = [];
	for (
		let count = start;
		step > 0 ? count < stop : count > stop;
		count += step
	) {
		result.push(count);
	}

	return result;
}
