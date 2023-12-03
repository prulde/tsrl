import { Position } from "../utils/position";
import { Glyph } from "../render/glyph";
import { Terminal } from "../render/terminal";

class Viewport {
	protected _x: number;
	protected _y: number;
	protected static _terminal: Terminal;

	protected _width: number;
	protected _height: number;

	constructor(x: number, y: number, width: number, height: number) {
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
	}

	public static makeTerminal(width: number, height: number, tilesetUrl: string, stepx: number, stepy: number): void {
		Viewport._terminal = new Terminal(width, height, tilesetUrl, stepx, stepy);
	}

	public putChar(glyph: Glyph, x: number, y: number): void {
		let position: Position | null = this.transform(x, y);
		if (position != null) {
			Viewport._terminal.putChar(glyph, position.x, position.y);
			return;
		}
	}

	public render(): void {
		Viewport._terminal.render();
	}

	private transform(x: number, y: number): Position | null {
		if (x < 0) return null;
		if (x >= this._width) return null;
		if (y < 0) return null;
		if (y >= this._height) return null;

		return new Position(this._x + x, this._y + y);
	}
}

export { Viewport };