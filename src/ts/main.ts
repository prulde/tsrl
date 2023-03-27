import Terminal from "./termial/terminal";
import Glyph from "./termial/glyph";
import Color from "./termial/color";
import GameScreen from "./screen/screen";
import PlayScreen from "./screen/play_screen";
import Actor from "./actor/actor";
import Breed from "./actor/breed";
import { Action, ActionResult } from "./action/action";
import GameMap from "./map/map";
import MapBuilder from "./map/map_builder";
import Tile from "./map/tile";
import { ActorStorage, ActorType } from "./storage/actor_storage";

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
let screenWidth: number = 50;
let screenHeight: number = 50;
// let fpsBar = document.createElement("p");
// document.querySelector("body")!.appendChild(fpsBar);

// game state and loop
class Game {
	public sightRadius: number;
	public currentMap: GameMap;
	public player: Actor;
	public currentScreen: GameScreen;
	private lastRender: number;

	constructor() {
		this.sightRadius = 8;
		this.lastRender = 0;

		this.currentMap = new MapBuilder(150, 150, 1).makeMap();
		this.player = ActorStorage.makeActor(25, 25, ActorType.player, null);
		this.currentScreen = new PlayScreen(screenWidth, screenHeight);

		this.currentMap.addActor(this.player);

		console.log("Game constructor");

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
				//this.currentScreen.moveCamera(this.player.x, this.player.y);
			}
			if (result.performed) {

			}
		}

		inputKey = InputKey.NO_INPUT;

		this.currentScreen.render(this.player.x, this.player.y);
	}

	private loop = (timestamp: number): void => {
		let progress: number = timestamp - this.lastRender;
		//fpsBar.innerText = (1 / (progress / 1000)).toFixed(4);
		//if (inputKey !== InputKey.NO_INPUT)
		this.update();

		this.lastRender = timestamp;
		window.requestAnimationFrame(this.loop);
	};
}

let terminal: Terminal = new Terminal(screenWidth, screenHeight, "data/cp437_16x16.png", 16, 16);
let game: Game;

document.addEventListener("imgLoaded", initGame.bind(this));

// sync image src load
function initGame(e: CustomEventInit): void {
	console.log("imgLoaded event");

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