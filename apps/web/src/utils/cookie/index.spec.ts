import { cookies } from 'src/utils/cookie/index';

describe('Cookies', () => {
	it('should save objects as json', () => {
		cookies.set('object', { id: 123 });
		expect(cookies.get('object')).toEqual({ id: 123 });

		cookies.set('array', [1, 2, 3]);
		expect(cookies.get('array')).toEqual([1, 2, 3]);
	});

	it('should save basic types correctly', () => {
		cookies.set('str', 'hi');
		expect(cookies.get('str')).toEqual('hi');

		cookies.set('num', 1);
		expect(cookies.get('num')).toEqual(1);
	});
});
