import path from 'path';
import { fs } from 'src/promises/fs';
import { default as nodeFs } from 'fs';

describe('Testing promisifiedFs', () => {
	test('should return a promise instead of callback', async () => {
		const currentFile = path.resolve(__dirname, path.basename(__filename));
		const promise = fs.readFile(currentFile, {
			encoding: 'utf8',
		});
		expect(typeof promise.then).toEqual('function');
		const returnValue = await promise;
		const content = nodeFs.readFileSync(currentFile, {
			encoding: 'utf8',
		});
		expect(returnValue).toEqual(content);
	});
});
