import { game } from "../main";

export default class Camera {
	private _width: number;
	private _height: number;
	private _camerax: number;
	private _cameray: number;

	constructor(width: number, height: number) {
		this._width = width;
		this._height = height;
		this._camerax = 1;
		this._cameray = 1;
	}

	moveCamera(targetx: number, targety: number): void {
		let x: number = targetx - (this._width / 2);
		let y: number = targety - (this._height / 2);

		if (x == this._camerax && y == this._cameray) {
			return;
		}

		if (x < 0)
			x = 0; // gui offset; Viewport starts at x=1 y=1
		if (y < 0)
			y = 0;
		if (x > (game.currentLevel.width - this._width))
			x = game.currentLevel.width - this._width;
		if (y > (game.currentLevel.height - this._height))
			y = game.currentLevel.height - this._height;

		this._camerax = x;
		this._cameray = y;
	}

	toCameraCoordinates(x: number, y: number) {
		let newx: number = x - this._camerax;
		let newy: number = y - this._cameray;

		if (newx < 0 || newy < 0 || newx >= this._width || newy >= this._height)
			return { _x: x, _y: y, inBounds: false };

		x = newx;
		y = newy;
		return { _x: x, _y: y, inBounds: true };
	}

	isInsideViewport(x: number, y: number): boolean {
		///???????
		if (x < 1 || y < 1 || x >= this._width + 1 || y >= this._height + 1)
			return false;
		return true;
	}

	getGlobalCoordinates(x: number, y: number) {
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