import { terminal } from "../main";
import Color from "../termial/color";
import Glyph from "../termial/glyph";

export default class Tile {
	static GRASS: Tile;
	static WALL: Tile;
	static BOUND: Tile;

	private readonly _glyph: Glyph;
	private readonly _blocks: boolean;

	// sync image src load
	static defineTiles(): void {
		this.GRASS = new Tile(terminal.defineGlyph(".", Color.green, Color.black), false);
		this.WALL = new Tile(terminal.defineGlyph("#", Color.grey, Color.black), true);
		this.BOUND = new Tile(terminal.defineGlyph("X", Color.red, Color.black), true);
		console.log("tiles defined");
	}

	constructor(glyph: Glyph, blocks: boolean) {
		this._glyph = glyph;
		this._blocks = blocks;
	}

	get glyph(): Glyph {
		return this._glyph;
	}

	get blocks(): boolean {
		return this._blocks;
	}
}