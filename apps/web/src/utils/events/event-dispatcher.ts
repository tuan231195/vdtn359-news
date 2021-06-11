import { Service } from 'typedi';
import { EventEmitter } from 'src/utils/events/event-emitter';

@Service({ global: true })
export class EventDispatcher extends EventEmitter {}
