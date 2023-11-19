export default class Config {
	private _noFov: boolean = true;
	private _noCollision: boolean = true;
	private _sightRadius: number = 8;
	private _screenWidth: number = 100;
	private _screenHeight: number = 100;

	get noFov(): boolean {
		return this._noFov;
	}

	get noCollision(): boolean {
		return this._noCollision;
	}

	get sightRadius(): number {
		return this._sightRadius;
	}

	get screenWidth(): number {
		return this._screenWidth;
	}

	get screenHeight(): number {
		return this._screenHeight;
	}

	set noFov(value: boolean) {
		this._noFov = value;
	}

	set noCollision(value: boolean) {
		this._noCollision = value;
	}

	set sightRadius(value: number) {
		this._sightRadius = value;
	}

	set screenWidth(value: number) {
		this._screenWidth = value;
	}

	set screenHeight(value: number) {
		this._screenHeight = value;
	}
}