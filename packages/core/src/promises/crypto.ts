import { default as nodeCrypto } from 'crypto';
import { promisifyAll } from 'src/promises/promisify';
import { PromisifyAll } from 'src/promises/types';

export const crypto: PromisifyAll<typeof nodeCrypto> = promisifyAll(nodeCrypto);
