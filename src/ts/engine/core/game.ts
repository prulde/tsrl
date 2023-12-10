import { InputKey } from "./input";

let lastRender: number;

abstract class Game {
	protected static inputKey: string;

	constructor() {
		Game.inputKey = InputKey.NO_INPUT;

		document.addEventListener("imgLoaded", this.initGame.bind(this));
		lastRender = 0;
	}

	protected abstract update(): void;

	// sync image src load 
	private initGame(e: CustomEventInit): void {
		document.removeEventListener("imgLoaded", this.initGame);
		document.addEventListener("keydown", this.kbInput, false);

		// start game loop 
		window.requestAnimationFrame(this.loop);
	}

	private loop = (timestamp: number): void => {
		this.update();
		Game.inputKey = InputKey.NO_INPUT;

		lastRender = timestamp;
		window.requestAnimationFrame(this.loop);
	};

	// user input
	private kbInput(e: KeyboardEvent): void {
		e.preventDefault();
		Game.inputKey = e.key;
	}
}

export { Game };