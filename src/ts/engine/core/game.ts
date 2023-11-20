import { Actor } from "../actor/actor";
import { Config } from "./config";
import { Level } from "../level/level";
import { Terminal } from "../render/terminal";
import { GameScreen } from "../screen/screen";
import { InputKey } from "./input";

let lastRender: number;

// let fpsBar = document.createElement("p");
// document.querySelector("body")!.appendChild(fpsBar);
abstract class Game {
	abstract config: Config;
	abstract terminal: Terminal;
	abstract player: Actor;
	abstract currentScreen: GameScreen;
	abstract currentLevel: Level;

	protected static inputKey: string;

	constructor() {
		document.addEventListener("imgLoaded", this.initGame.bind(this));
		Game.inputKey = InputKey.NO_INPUT;
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
	protected kbInput(e: KeyboardEvent): void {
		e.preventDefault();
		Game.inputKey = e.key;
	}
}

export { Game };