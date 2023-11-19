import Terminal from "./render/terminal";
import Glyph from "./render/glyph";
import Color from "./render/color";
import Screen from "./screen/screen";
import PlayScreen from "./screen/play_screen";
import Actor from "./actor/actor";
import { Action, ActionResult } from "./action/action";
import Level from "./level/level";
import MapBuilder from "./level/map_builder";
import Hero from "./actor/hero/hero";
import Config from "./config";
import { Fov } from "./level/fov";

const InputKey = {
	NO_INPUT: "",
	MN: "(0,-1)",
	MS: "(0,1)",
	MW: "(-1,0)",
	ME: "(1,0)",
	MNE: "(1,-1)",
	MNW: "(-1,-1)",
	MSE: "(1,1)",
	MSW: "(-1,1)",
	SKIP: "skip",
	PICKUP: "pickup",
};

let inputKey: string = InputKey.NO_INPUT;
// let fpsBar = document.createElement("p");
// document.querySelector("body")!.appendChild(fpsBar);

// game state and loop 
class Game {
	public config: Config;
	public terminal: Terminal;
	public player: Actor;
	public currentScreen: Screen;
	public currentLevel: Level;
	private lastRender: number;

	constructor() {
		this.config = new Config();
		this.lastRender = 0;

		this.currentLevel = new MapBuilder(100, 100, 1).makeMap();
		this.player = new Hero(25, 25, new Glyph("@", Color.white, Color.black));
		this.currentScreen = new PlayScreen(this.config.screenWidth, this.config.screenHeight);

		this.currentLevel.addActor(this.player);
		this.currentLevel.computeFov(this.player.position, this.config.sightRadius, Fov.RecursiveShadowcasting);

		// terminal
		this.terminal = new Terminal(this.config.screenWidth, this.config.screenHeight, "data/cp437_16x16_test.png", 16, 16);
		document.addEventListener("imgLoaded", this.initGame.bind(this));
	}

	// sync image src load 
	private initGame(e: CustomEventInit): void {
		document.removeEventListener("imgLoaded", this.initGame);
		document.addEventListener("keydown", kbInput, false);
		// start game loop 
		window.requestAnimationFrame(this.loop);
	}

	private update(): void {
		let action: Action | null = this.currentScreen.getKeyAction(inputKey);
		if (action) {
			let result: ActionResult = action.perform(this.player);
			while (result.altAction) {
				action = result.altAction;
				result = action.perform(this.player);
			}
			if (result.altAction) {

			}
			if (result.moved) {
				this.currentLevel.computeFov(this.player.position, this.config.sightRadius, Fov.RecursiveShadowcasting);
				//this.currentScreen.moveCamera(this.player.x, this.player.y);
			}
			if (result.performed) {

			}
		}

		inputKey = InputKey.NO_INPUT;

		this.currentScreen.render(this.player.position);
	}

	private loop = (timestamp: number): void => {
		// let progress: number = timestamp - this.lastRender;
		// fpsBar.innerText = (1 / (progress / 1000)).toFixed(4);
		// if (inputKey !== InputKey.NO_INPUT)
		this.update();

		this.lastRender = timestamp;
		window.requestAnimationFrame(this.loop);
	};
}

let game: Game = new Game();

function kbInput(e: KeyboardEvent): void {
	switch (e.key) {
		case "ArrowUp":
		case "w":
			e.preventDefault();
			inputKey = InputKey.MN;
			break;
		case "ArrowDown":
		case "s":
			e.preventDefault();
			inputKey = InputKey.MS;
			break;
		case "ArrowLeft":
		case "a":
			e.preventDefault();
			inputKey = InputKey.MW;
			break;
		case "ArrowRight":
		case "d":
			e.preventDefault();
			inputKey = InputKey.ME;
			break;
		case "Home":
		case "q":
			e.preventDefault();
			inputKey = InputKey.MNW;
			break;
		case "PageUp":
		case "e":
			e.preventDefault();
			inputKey = InputKey.MNE;
			break;
		case "End":
		case "z":
			e.preventDefault();
			inputKey = InputKey.MSW;
			break;
		case "PageDown":
		case "c":
			e.preventDefault();
			inputKey = InputKey.MSE;
			break;
		case " ":
			e.preventDefault();
			if (e.code == "Space" || e.keyCode == 32) { // ??
				inputKey = InputKey.SKIP;
			}
			break;
		default:
			break;
	}
}

export { InputKey, game };