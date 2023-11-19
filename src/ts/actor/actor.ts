import Glyph from "../render/glyph";
import Position from "../util/position";

export default abstract class Actor {
	private _position: Position;
	private _glyph: Glyph;
	private _hp: number;
	private _blocks: boolean;

	constructor(x: number, y: number, glyph: Glyph) {
		this._position = new Position(x, y);
		this._glyph = glyph;
		this._blocks = true;
		this._hp = 0;
	};

	public abstract isPlayer(): boolean;

	get position(): Position {
		return this._position;
	}

	get glyph(): Glyph {
		return this._glyph;
	}

	get blocks(): boolean {
		return this._blocks;
	}

	get hp(): number {
		return this._hp;
	}

	set position(pos: Position) {
		this._position = pos;
	}

	set glyph(glyph: Glyph) {
		this._glyph = glyph;
	}

	set blocks(blocks: boolean) {
		this._blocks = blocks;
	}

	set hp(hp: number) {
		this._hp = hp;
	}
};