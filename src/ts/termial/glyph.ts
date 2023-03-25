import Color from "./color";
import CharCode from "./charcode";

export default class Glyph {
	private readonly _glyph: number;
	private readonly _fcolor: Color;
	private readonly _bcolor: Color;
	private readonly _glyphData: ImageData;
	private readonly _tintedGlyphData: ImageData;

	constructor(glyph: number, fcolor: Color, bcolor: Color, data: ImageData, darkerGlyph: ImageData) {
		this._glyph = glyph;
		this._fcolor = fcolor;
		this._bcolor = bcolor;
		this._glyphData = data;
		this._tintedGlyphData = darkerGlyph;
	}

	get glyphData(): ImageData {
		return this._glyphData;
	}

	get fcol(): Color {
		return this._fcolor;
	}

	get bcol(): Color {
		return this._bcolor;
	}

	// get glyph(): number {
	// 	return this._glyph;
	// }

	get tintedGlyphData(): ImageData {
		return this._tintedGlyphData;
	}
}