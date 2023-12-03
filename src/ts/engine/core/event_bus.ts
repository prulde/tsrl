interface Registry {
	unregister: () => void;
}

interface Callable {
	[key: string]: Function;
}

interface Subscriber {
	[key: string]: Callable;
}

interface IEventBus {
	dispatch<T extends keyof EventArgs>(event: T, ...args: EventArgs[T]): void;
	register<T extends keyof EventArgs>(event: T, callback: (...args: EventArgs[T]) => void): Registry;
}

interface EventArgs {
	requestTextures: [number, number];
}

class EventBus implements IEventBus {
	private static instance?: EventBus = undefined;
	private subscribers: Subscriber;
	private nextId: number;

	private constructor() {
		this.subscribers = {};
		this.nextId = 0;
	}

	public static getInstance(): EventBus {
		if (this.instance === undefined) {
			this.instance = new EventBus();
		}

		return this.instance;
	}

	public dispatch<T extends keyof EventArgs>(event: string, ...args: EventArgs[T]): void {
		const subscriber: Callable = this.subscribers[event];

		if (subscriber === undefined) {
			return;
		}

		Object.keys(subscriber).forEach((key: string) => subscriber[key](...args));
	}

	public register<T extends keyof EventArgs>(event: T, callback: (...args: EventArgs[T]) => void): Registry {
		const id: number = this.getNextId();
		if (!this.subscribers[event]) this.subscribers[event] = {};

		this.subscribers[event][id] = callback;

		return {
			unregister: (): void => {
				delete this.subscribers[event][id];
				if (Object.keys(this.subscribers[event]).length === 0)
					delete this.subscribers[event];
			},
		};
	}

	private getNextId(): number {
		return this.nextId++;
	}
}

export { Registry, Callable, Subscriber, IEventBus, EventBus, EventArgs };