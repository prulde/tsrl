import Color from "../termial/color";
import Glyph from "../termial/glyph";

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