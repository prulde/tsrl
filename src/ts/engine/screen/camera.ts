import { Game } from "../core/game";
import { config } from "../engine";

class Camera {
	private _camerax: number = 1;
	private _cameray: number = 1;

	constructor() {
		this._camerax = 1;
		this._cameray = 1;
	}

	public moveCamera(targetx: number, targety: number, game: Game): void {
		let x: number = targetx - (config.screenWidth / 2);
		let y: number = targety - (config.screenHeight / 2);

		if (x == this._camerax && y == this._cameray) {
			return;
		}

		if (x < 0)
			x = 0; // gui offset; Viewport starts at x=1 y=1
		if (y < 0)
			y = 0;
		if (x > (game.currentLevel.width - config.screenWidth))
			x = game.currentLevel.width - config.screenWidth;
		if (y > (game.currentLevel.height - config.screenHeight))
			y = game.currentLevel.height - config.screenHeight;

		this._camerax = x;
		this._cameray = y;
	}

	public toCameraCoordinates(x: number, y: number) {
		let newx: number = x - this._camerax;
		let newy: number = y - this._cameray;

		if (newx < 0 || newy < 0 || newx >= config.screenWidth || newy >= config.screenHeight)
			return { _x: x, _y: y, inBounds: false };

		x = newx;
		y = newy;
		return { _x: x, _y: y, inBounds: true };
	}

	public isInsideViewport(x: number, y: number): boolean {
		///???????
		if (x < 1 || y < 1 || x >= config.screenWidth + 1 || y >= config.screenHeight + 1)
			return false;
		return true;
	}

	public getGlobalCoordinates(x: number, y: number) {
		///???????
		if (x < 1 || y < 1 || x >= config.screenWidth + 1 || y >= config.screenHeight + 1)
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
		return config.screenWidth;
	}

	get height(): number {
		return config.screenHeight;
	}
}

export { Camera };