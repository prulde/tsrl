import Terminal from "./render/terminal";
import Glyph from "./render/glyph";
import Color from "./render/color";
import GameScreen from "./screen/screen";
import PlayScreen from "./screen/play_screen";
import Actor from "./actor/actor";
import { Action, ActionResult } from "./action/action";
import Level from "./level/level";
import MapBuilder from "./level/map_builder";
import Tile from "./level/tile";
import Fov from "./level/fov";
import RegularLevel from "./level/regular_level";
import Hero from "./actor/hero/hero";

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
let screenWidth: number = 100;
let screenHeight: number = 100;
// let fpsBar = document.createElement("p");
// document.querySelector("body")!.appendChild(fpsBar);

// game state and loop 
class Game {
	public sightRadius: number;
	public player: Actor;
	public currentScreen: GameScreen;
	public currentLevel: RegularLevel;
	public playerFov: Fov;
	private lastRender: number;

	// debug 
	public noFov: boolean = true;
	public noCollision: boolean = true;

	constructor() {
		this.sightRadius = 8;
		this.lastRender = 0;

		this.currentLevel = new MapBuilder(100, 100, 1).makeMap();
		this.playerFov = new Fov(this.currentLevel, 8);
		this.player = new Hero(25, 25, new Glyph("@", Color.white, Color.black));
		this.currentScreen = new PlayScreen(screenWidth, screenHeight);

		this.currentLevel.addActor(this.player);
		this.playerFov.computeFov(this.player.x, this.player.y);

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
				this.playerFov.computeFov(this.player.x, this.player.y);
				//this.currentScreen.moveCamera(this.player.x, this.player.y);
			}
			if (result.performed) {

			}
		}

		inputKey = InputKey.NO_INPUT;

		this.currentScreen.render(this.player.x, this.player.y);
	}

	private loop = (timestamp: number): void => {
		// let progress: number = timestamp - this.lastRender;
		//fpsBar.innerText = (1 / (progress / 1000)).toFixed(4);
		//if (inputKey !== InputKey.NO_INPUT)
		this.update();

		this.lastRender = timestamp;
		window.requestAnimationFrame(this.loop);
	};
}

let terminal: Terminal = new Terminal(screenWidth, screenHeight, "data/cp437_16x16_test.png", 16, 16);
let game: Game;

document.addEventListener("imgLoaded", initGame.bind(this));

// sync image src load 
function initGame(e: CustomEventInit): void {

	game = new Game();

	document.removeEventListener("imgLoaded", initGame);
	document.addEventListener("keydown", kbInput, false);
}

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

export { InputKey, game, terminal };