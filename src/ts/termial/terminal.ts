import Glyph from "./glyph";
import Color from "./color";
import CharCode from "./charcode";

export default class Terminal {
	private width: number;
	private height: number;
	private stepx: number;
	private stepy: number;

	private widthPixels: number;
	private heightPixels: number;

	private tileset: HTMLImageElement;

	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D | null;
	private cachedFonts: Map<Color, HTMLCanvasElement> = new Map();

	private glyphs: Glyph[] = [];
	private changedGlyphs: (Glyph | null)[] = [];

	private imgLoaded: CustomEvent;

	constructor(width: number, height: number, tilesetUrl: string, stepx: number, stepy: number) {
		this.width = width;
		this.height = height;

		this.stepx = stepx;
		this.stepy = stepy;

		this.widthPixels = width * stepx;
		this.heightPixels = height * stepy;

		this.canvas = document.createElement("canvas");
		this.canvas.width = this.widthPixels;
		this.canvas.height = this.heightPixels;
		document.body.appendChild(this.canvas);

		this.ctx = this.canvas.getContext("2d", { alpha: false, willReadFrequently: true });
		this.ctx!.imageSmoothingEnabled = false;

		this.imgLoaded = new CustomEvent("imgLoaded");

		this.tileset = new Image();
		this.tileset.onload = ((): void => this.tilesetLoaded());
		this.tileset.src = tilesetUrl;
	}

	private makeColoredCanvas(fontColor: Color): HTMLCanvasElement {
		let canvas: HTMLCanvasElement = document.createElement("canvas");
		canvas.width = this.widthPixels;
		canvas.height = this.heightPixels;
		let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d", { willReadFrequently: true });
		ctx!.drawImage(this.tileset, 0, 0);

		ctx!.globalCompositeOperation = "source-atop";
		ctx!.fillStyle = "rgb(" + fontColor.r + ", " + fontColor.g + ", " + fontColor.b + ")";
		ctx!.fillRect(0, 0, this.stepx * 16, this.stepy * 16);

		return canvas;
	}

	private tilesetLoaded(): void {
		console.log(`loaded: ${this.tileset.src}`);

		// initialize cached colors
		Color.colors.forEach((color: Color): void => {
			this.cachedFonts.set(color, this.makeColoredCanvas(color));
		});

		//this.ctx!.drawImage(this.tileset, 0, 0);

		// for (let i: number = 0; i < 16; ++i) {
		// 	for (let j: number = 0; j < 16; ++j) {
		// 		this.ctx!.fillStyle = "rgb(" + i + 5 + ", " + j + 5 + ", " + i + 5 + ")";
		// 		this.ctx!.fillRect(i * this.stepx, j * this.stepy, this.stepx, this.stepy);

		// 		let fillColor: string = "rgb(" + Color.green.r + ", " + Color.green.g + ", " + Color.green.b + ")";
		// 		let color: HTMLCanvasElement = this.makeColoredCanvas(fillColor);

		// 		this.ctx!.drawImage(color, i * this.stepx, j * this.stepy, this.stepx, this.stepy, i * this.stepx, j * this.stepx, this.stepx, this.stepy);
		// 	}
		// };

		//this.clear();

		// trigger event
		document.dispatchEvent(this.imgLoaded);
	}

	public clear(): void {
		this.ctx!.fillStyle = "#000000";
		this.ctx!.fillRect(0, 0, this.widthPixels, this.heightPixels);
	}

	public putChar(glyph: Glyph, x: number, y: number): void {
		if (x < 0 || x > this.width) throw new RangeError(`x:${x} must be within range [0,${this.width}]`);
		if (y < 0 || y > this.height) throw new RangeError(`y:${y} must be within range [0,${this.height}]`);

		this.changedGlyphs[x + y * this.width] = glyph;
	}

	/** @todo */
	// public write(str: string, x: number, y: number, fcol: Color, bcol: Color) {
	// 	if (x + str.length > this.width) throw new RangeError(`x+string.lenght:${y} must be less than ${this.height}]`);
	// 	if (x < 0 || x >= this.width) throw new RangeError(`x:${x} must be within range [0,${this.width}]`);
	// 	if (y < 0 || y >= this.height) throw new RangeError(`y:${y} must be within range [0,${this.height}]`);

	// 	for (let i: number = 0; i < str.length; i++) {
	// 		this.putChar(str.charAt(i), x + i, y);
	// 	}
	// };

	public render(): void {
		//let count: number = 0;
		for (let x: number = 0; x < this.width; ++x) {
			for (let y: number = 0; y < this.height; ++y) {
				let glyph: Glyph | null = this.changedGlyphs[x + y * this.width];
				if (glyph === null || glyph === undefined) continue;
				if (this.changedGlyphs[x + y * this.width] == this.glyphs[x + y * this.width]) continue;
				//count++;

				let char: number = glyph.char;
				let sx: number = Math.floor(char % this.stepx) * this.stepx;
				let sy: number = Math.floor(char / this.stepx) * this.stepy;

				this.ctx!.fillStyle = "rgb(" + glyph.bcol.r + ", " + glyph.bcol.g + ", " + glyph.bcol.b + ")";
				this.ctx!.fillRect(x * this.stepx, y * this.stepy, this.stepx, this.stepy);

				let color: HTMLCanvasElement | undefined = this.cachedFonts.get(glyph.fcol);
				if (color === undefined) {
					throw new TypeError(`${glyph.fcol} is undefined`);
				}

				//tilesetx,tilesety, stepx,stepy, destinationx,destinationy,scalex,scaley
				this.ctx!.drawImage(color!, sx, sy, this.stepx, this.stepy, x * this.stepx, y * this.stepy, this.stepx, this.stepy);

				this.glyphs[x + y * this.width] = glyph;
				this.changedGlyphs[x + y * this.width] = null;
			}
		}
		//count == 0 ? "" : console.log(`number of calls to drawImage(): ${count}`);
	}
}