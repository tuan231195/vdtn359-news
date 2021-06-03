import { default as nodeFs } from 'fs';
import { PromisifyAll } from 'src/promises/types';
import { promisifyAll } from 'src/promises/promisify';
import { proxy } from '@vdtn359/news-utils';

export class FsExtension {
	constructor(private readonly fsPromise: PromisifyAll<typeof nodeFs>) {}

	writeJSON(filePath, json, options = { encoding: 'utf8', prettify: true }) {
		return this.fsPromise.writeFile(
			filePath,
			options.prettify
				? JSON.stringify(json, null, 4)
				: JSON.stringify(json),
			options
		);
	}
}
type FsExtensionType = PromisifyAll<typeof nodeFs> & FsExtension;
const fsPromise = promisifyAll(nodeFs);
const fsExtension = new FsExtension(fsPromise);
export const fs: FsExtensionType = proxy.wrap(fsExtension, fsPromise);
