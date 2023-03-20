import Terminal from "./simple-roguelike-terminal/terminal";
import { Glyph, Color } from "./simple-roguelike-terminal/glyph";

class Game {
	public sightRadius: number;
	public contentStorage: null;
	public currentMap: null;
	public player: null;
	public currentScreen: null;

	constructor() {
		this.sightRadius = 8;
		this.contentStorage = null;
		this.currentMap = null;
		this.player = null;
		this.currentScreen = null;
		console.log("Game constructor");

		let player: Glyph = terminal.defineGlyph(64, Color.white, Color.black);
		let player2: Glyph = terminal.defineGlyph(64, Color.red, Color.black);
		terminal.putChar(player, 25, 25);
		terminal.putChar(player2, 26, 25);
		terminal.render();
	};
};

let terminal: Terminal = new Terminal(50, 50, "data/cp437_16x16.png", 16, 16);
let game: Game;

document.addEventListener("imgLoaded", gameInit.bind(this));

function gameInit(e: CustomEventInit): void {
	console.log("imgLoaded event");
	game = new Game();
	document.removeEventListener("imgLoaded", gameInit);
};
