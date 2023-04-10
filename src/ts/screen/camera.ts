import { game } from "../main";

export default class Camera {
	private width: number;
	private height: number;
	private camerax: number;
	private cameray: number;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.camerax = 1;
		this.cameray = 1;
	}

	moveCamera(targetx: number, targety: number): void {
		let x: number = targetx - (this.width / 2);
		let y: number = targety - (this.height / 2);

		if (x == this.camerax && y == this.cameray) {
			return;
		}

		if (x < 0)
			x = 0; // gui offset; Viewport starts at x=1 y=1
		if (y < 0)
			y = 0;
		if (x > (game.currentMap.width - this.width))
			x = game.currentMap.width - this.width;
		if (y > (game.currentMap.height - this.height))
			y = game.currentMap.height - this.height;

		this.camerax = x;
		this.cameray = y;
	}

	toCameraCoordinates(x: number, y: number) {
		let newx: number = x - this.camerax;
		let newy: number = y - this.cameray;

		if (newx < 0 || newy < 0 || newx >= this.width || newy >= this.height)
			return { _x: x, _y: y, inBounds: false };

		x = newx;
		y = newy;
		return { _x: x, _y: y, inBounds: true };
	}

	isInsideViewport(x: number, y: number): boolean {
		///???????
		if (x < 1 || y < 1 || x >= this.width + 1 || y >= this.height + 1)
			return false;
		return true;
	}

	getGlobalCoordinates(x: number, y: number) {
		///???????
		if (x < 1 || y < 1 || x >= this.width + 1 || y >= this.height + 1)
			return { x: x, y: y, inBounds: false };

		x += this.camerax;
		y += this.cameray;
		return { _x: x, _y: y, inBounds: true };
	}

	getCamerax(): number {
		return this.camerax;
	}

	getCameray(): number {
		return this.cameray;
	}

	getWidth(): number {
		return this.width;
	}

	getHeight(): number {
		return this.height;
	}
}