import { Viewport } from "./viewport";

class Camera extends Viewport {
	private _camerax: number = 1;
	private _cameray: number = 1;

	// level bounds
	private _boundWidth: number;
	private _boundHeight: number;

	constructor(x: number, y: number, width: number, height: number, boundWidth: number, boundHeigh: number) {
		super(x, y, width, height);
		this._camerax = 1;
		this._cameray = 1;
		this._boundWidth = boundWidth;
		this._boundHeight = boundHeigh;
	}

	public moveCamera(targetx: number, targety: number): void {
		let x: number = targetx - (this._width / 2);
		let y: number = targety - (this._height / 2);

		if (x == this._camerax && y == this._cameray) {
			return;
		}

		if (x < 0)
			x = 0; // gui offset; Viewport starts at x=1 y=1
		if (y < 0)
			y = 0;
		if (x > (this._boundWidth - this._width))
			x = this._boundWidth - this._width;
		if (y > (this._boundHeight - this._height))
			y = this._boundHeight - this._height;

		this._camerax = x;
		this._cameray = y;
	}

	public toCameraCoordinates(x: number, y: number) {
		let newx: number = x - this._camerax;
		let newy: number = y - this._cameray;

		if (newx < 0 || newy < 0 || newx >= this._width || newy >= this._height)
			return { _x: x, _y: y, inBounds: false };

		x = newx;
		y = newy;
		return { _x: x, _y: y, inBounds: true };
	}

	public isInsideViewport(x: number, y: number): boolean {
		///???????
		if (x < 1 || y < 1 || x >= this._width + 1 || y >= this._height + 1)
			return false;
		return true;
	}

	public getGlobalCoordinates(x: number, y: number) {
		///???????
		if (x < 1 || y < 1 || x >= this._width + 1 || y >= this._height + 1)
			return { x: x, y: y, inBounds: false };

		x += this._camerax;
		y += this._cameray;
		return { _x: x, _y: y, inBounds: true };
	}

	get camerax(): number {
		return this._camerax;
	}

	get cameray(): number {
		return this._cameray;
	}

	get width(): number {
		return this._width;
	}

	get height(): number {
		return this._height;
	}
}

export { Camera };