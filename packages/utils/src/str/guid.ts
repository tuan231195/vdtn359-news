import uuidByString from 'uuid-by-string';
import { v4 as nodeUUID } from 'uuid';

export function toGuid(str): string {
	return uuidByString(str).replace(/-/g, '');
}

export function uuid(): string {
	return nodeUUID();
}
