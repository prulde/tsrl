import Color from "./color";

export default class Glyph {
	private readonly _glyph: number;
	private readonly _fcolor: Color;
	private readonly _bcolor: Color;

	constructor(glyph: number | string, fcolor: Color, bcolor: Color) {

		/**@todo map glyphs to charmap  */

		if (typeof glyph === "string") {
			glyph = glyph.charCodeAt(0);
		};
		this._glyph = glyph;
		this._fcolor = fcolor;
		this._bcolor = bcolor;
	}

	get fcol(): Color {
		return this._fcolor;
	}

	get bcol(): Color {
		return this._bcolor;
	}

	get char(): number {
		return this._glyph;
	}

}