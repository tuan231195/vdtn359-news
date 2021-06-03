import { default as nodeZlib } from 'zlib';
import { promisifyAll } from 'src/promises/promisify';
import { PromisifyAll } from 'src/promises/types';

export const zlib: PromisifyAll<typeof nodeZlib> = promisifyAll(nodeZlib);
