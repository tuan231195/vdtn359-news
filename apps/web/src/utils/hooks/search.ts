import { useCallback, useRef, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import {
	debounceTime,
	distinctUntilChanged,
	switchMap,
	tap,
} from 'rxjs/operators';
import { useEffectOnce } from 'src/utils/hooks/basic';

export function useSearch(processor: (str: string) => any): any {
	const subject = useRef<BehaviorSubject<string>>(new BehaviorSubject(''));
	const [results, setResults] = useState(null);
	const [loading, setLoading] = useState(false);
	const [typing, setTyping] = useState(false);
	const debounceRate = 700;
	useEffectOnce(() => {
		subject.current
			.pipe(
				distinctUntilChanged(),
				debounceTime(debounceRate),
				switchMap(async (search) => {
					if (search.length < 3) {
						return null;
					}
					setLoading(true);
					try {
						return await processor(search);
					} finally {
						setLoading(false);
					}
				})
			)
			.subscribe((result) => {
				setResults(result);
			});
		subject.current
			.pipe(
				distinctUntilChanged(),
				tap(() => {
					if (!typing) {
						setTyping(true);
					}
				}),
				debounceTime(debounceRate)
			)
			.subscribe(() => {
				setTyping(false);
			});
	});
	const changeSearch = useCallback(
		(str) => subject.current.next(str),
		[subject]
	);
	return [{ results, loading, typing }, changeSearch];
}
