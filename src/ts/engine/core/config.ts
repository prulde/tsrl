class Config {
	constructor(
		private _noFov: boolean,
		private _noCollision: boolean,
		private _sightRadius: number,
		private _screenWidth: number,
		private _screenHeight: number,
		private _tilesetPath: string,
		private _stepx: number,
		private _stepy: number,
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

	get tilesetPath(): string {
		return this._tilesetPath;
	}

	get stepx(): number {
		return this._stepx;
	}

	get stepy(): number {
		return this._stepy;
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

// singleton
let config: Config;

class ConfigBuilder {
	private _noFov: boolean = false;
	private _noCollision: boolean = false;
	private _sightRadius: number = 8;
	private _screenWidth: number = 100;
	private _screenHeight: number = 100;
	private _tilesetPath: string;
	private _stepx: number;
	private _stepy: number;

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

	public tilesetPath(value: string): this {
		this._tilesetPath = value;
		return this;
	}

	public stepXstepY(x: number, y: number): this {
		this._stepx = x;
		this._stepy = y;
		return this;
	}

	private validate(): void {
		if (this._tilesetPath === undefined)
			throw new Error("tilesetPath must be defined");
		if (this._stepx === undefined || this._stepy === undefined)
			throw new Error("stepX and stepY must be defined");

		if (this._noFov)
			console.log("noFov: true");
		if (this._noCollision)
			console.log("noCollision: true");
	}

	public build(): void {
		this.validate();
		config = new Config(
			this._noFov,
			this._noCollision,
			this._sightRadius,
			this._screenWidth,
			this._screenHeight,
			this._tilesetPath,
			this._stepx,
			this._stepy,
		);
	}
};

export { ConfigBuilder, config };