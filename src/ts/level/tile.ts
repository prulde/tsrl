import Color from "../render/color";
import Glyph from "../render/glyph";

export default class Tile {
	static GRASS: Tile = new Tile(new Glyph(".", Color.green, Color.black), false);
	static WALL: Tile = new Tile(new Glyph("#", Color.grey, Color.black), true);
	// dont delete
	static FOG: Tile = new Tile(new Glyph("#", Color.black, Color.black), false);
	static BOUND: Tile = new Tile(new Glyph("X", Color.red, Color.black), true);
	static FLOOR: Tile = new Tile(new Glyph(".", Color.grey, Color.black), false);
	static DOOR: Tile = new Tile(new Glyph("+", Color.amber, Color.black), false);
	static OPEN_DOOR: Tile = new Tile(new Glyph("/", Color.amber, Color.black), false);

	static TEST_DOOR: Tile = new Tile(new Glyph("#", new Color(150, 80, 0), Color.black), true);
	static TEST_WALL: Tile = new Tile(new Glyph("#", new Color(0, 120, 0), Color.black), true);
	static TEST_FLOOR: Tile = new Tile(new Glyph("#", Color.darkestGrey, Color.black), false);

	private readonly _glyph: Glyph;
	private readonly _tintedGlyph: Glyph;
	private _blocks: boolean;
	private _explored: boolean = false;

	constructor(glyph: Glyph, blocks: boolean) {
		this._glyph = glyph;
		this._tintedGlyph = new Glyph(this._glyph.char, Color.makeDarker(this._glyph.fcol, 0.5), this._glyph.bcol);
		this._blocks = blocks;
	}

	get glyph(): Glyph {
		return this._glyph;
	}

	get tintedGlyph(): Glyph {
		return this._tintedGlyph;
	}

	get blocks(): boolean {
		return this._blocks;
	}

	get explored(): boolean {
		return this._explored;
	}

	set explored(explored: boolean) {
		this._explored = explored;
	}
}