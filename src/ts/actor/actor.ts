import Glyph from "../render/glyph";

export default abstract class Actor {
	private _x: number;
	private _y: number;
	private _glyph: Glyph;
	private _hp: number;
	private _blocks: boolean;

	constructor(x: number, y: number, glyph: Glyph) {
		this._x = x;
		this._y = y;
		this._glyph = glyph;
		this._blocks = true;
		this._hp = 0;
	};

	public abstract isPlayer(): boolean;

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
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

	set x(x: number) {
		this._x = x;
	}

	set y(y: number) {
		this._y = y;
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