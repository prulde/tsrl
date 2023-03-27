import { terminal } from "../main";
import Color from "../termial/color";
import Glyph from "../termial/glyph";

export default class Tile {
	static GRASS: Tile = new Tile(new Glyph(".", Color.green, Color.black), false);;
	static WALL: Tile = new Tile(new Glyph("#", Color.grey, Color.black), true);;
	static BOUND: Tile = new Tile(new Glyph("X", Color.red, Color.black), true);;

	private readonly _glyph: Glyph;
	private readonly _blocks: boolean;

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