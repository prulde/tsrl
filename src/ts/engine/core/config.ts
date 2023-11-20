class Config {
	constructor(
		private _noFov: boolean = true,
		private _noCollision: boolean = true,
		private _sightRadius: number = 8,
		private _screenWidth: number = 100,
		private _screenHeight: number = 100
	) { }

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

class ConfigBuilder {
	private _noFov: boolean = true;
	private _noCollision: boolean = true;
	private _sightRadius: number = 8;
	private _screenWidth: number = 100;
	private _screenHeight: number = 100;

	public noFov(value: boolean): this {
		this._noFov = value;
		return this;
	}

	public noCollision(value: boolean): this {
		this._noCollision = value;
		return this;
	}

	public sightRadius(value: number): this {
		this._sightRadius = value;
		return this;
	}

	public screenWidth(value: number): this {
		this._screenWidth = value;
		return this;
	}

	public screenHeight(value: number): this {
		this._screenHeight = value;
		return this;
	}

	public build(): Config {
		return new Config(
			this._noFov,
			this._noCollision,
			this._sightRadius,
			this._screenWidth,
			this._screenHeight
		);
	}
};

export { Config, ConfigBuilder };