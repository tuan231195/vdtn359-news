import { EventEmitter } from 'src/utils/events/event-emitter';

export class Trigger {
	private readonly eventEmitter = new EventEmitter();

	trigger() {
		this.eventEmitter.trigger('trigger');
	}

	onTrigger(callback) {
		return this.eventEmitter.on('trigger', callback);
	}
}
