import { Service } from 'typedi';
import { EventDispatcher } from 'src/utils/events/event-dispatcher';
import { SIDEBAR_CLOSED, WINDOW_CLICK } from 'src/utils/events/event.constants';

@Service()
export class NewsApp {
	constructor(private readonly eventDispatcher: EventDispatcher) {}

	onWindowClick(eventHandler) {
		return this.eventDispatcher.on(WINDOW_CLICK, eventHandler);
	}

	onSideBarClosed(eventHandler) {
		return this.eventDispatcher.on(SIDEBAR_CLOSED, eventHandler);
	}
}
