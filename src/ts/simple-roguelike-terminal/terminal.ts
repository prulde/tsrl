import { Glyph, Color } from "./glyph";
import Display from "./display";

export default class Terminal {
	private width: number;
	private height: number;
	private stepx: number;
	private stepy: number;

	private widthPixels: number;
	private heightPixels: number;

	private tileset: HTMLImageElement;

	private tiles: ImageData[] = [];

	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D | null;

	private display: Display;

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
		this.ctx = this.canvas.getContext("2d", { alpha: false, willReadFrequently: true });
		this.ctx!.imageSmoothingEnabled = false;
		document.body.appendChild(this.canvas);

		this.imgLoaded = new CustomEvent("imgLoaded");

		this.tileset = new Image();
		this.tileset.onload = ((): void => this.tilesetLoaded());
		this.tileset.src = tilesetUrl;

		this.display = new Display(width, height);
	};

	private tilesetLoaded(): void {
		console.log(`loaded: ${this.tileset.src}`);

		this.ctx!.drawImage(this.tileset, 0, 0);
		for (let i: number = 0; i < 16; ++i) {
			for (let j: number = 0; j < 16; ++j) {
				this.tiles.push(this.ctx!.getImageData(j * this.stepx, i * this.stepy, this.stepx, this.stepy));
			}
		}

		this.clear();

		// trigger event
		document.dispatchEvent(this.imgLoaded);
	};

	public defineGlyph(glyph: number, fcolor: Color, bcolor: Color, factor: number = 0.3): Glyph {
		if (glyph < 0) throw new RangeError(`out of tileset bounds: ${glyph}<0`);//return null;
		if (glyph >= 256) throw new RangeError(`out of tileset bounds: ${glyph}>=256`);//return null;

		let glyphData!: ImageData;
		let darkerGlyphData!: ImageData;
		let darkerFColor: Color = Color.makeDarker(fcolor, factor);
		let darkerBColor: Color = Color.makeDarker(bcolor, factor);

		let currentTile = 0;
		this.tiles.forEach((tile: ImageData): void => {
			if (currentTile != glyph) {
				currentTile++;
				return;
			}

			currentTile++;

			glyphData = structuredClone(tile);
			darkerGlyphData = structuredClone(tile);
			let imgData: Uint8ClampedArray = glyphData.data;
			let darkerImgData: Uint8ClampedArray = darkerGlyphData.data;

			for (let y: number = 0; y < this.stepx; ++y) {
				for (let x: number = 0; x < this.stepy; ++x) {
					let index: number = (x + this.stepx * y) * 4;
					if (imgData[index] === 255 && imgData[index + 1] === 255 && imgData[index + 2] === 255) {
						imgData[index] = fcolor.r;
						imgData[index + 1] = fcolor.g;
						imgData[index + 2] = fcolor.b;

						darkerImgData[index] = darkerFColor.r;
						darkerImgData[index + 1] = darkerFColor.g;
						darkerImgData[index + 2] = darkerFColor.b;
					} else if (imgData[index] === 0 && imgData[index + 1] === 0 && imgData[index + 2] === 0) {
						imgData[index] = bcolor.r;
						imgData[index + 1] = bcolor.g;
						imgData[index + 2] = bcolor.b;

						// stays 0 for black color
						darkerImgData[index] = darkerBColor.r;
						darkerImgData[index + 1] = darkerBColor.g;
						darkerImgData[index + 2] = darkerBColor.b;
					};
				};
			};
		});

		return new Glyph(glyph, fcolor, bcolor, glyphData, darkerGlyphData);
	};

	public clear(): void {
		this.ctx!.fillStyle = "#000000";
		this.ctx!.fillRect(0, 0, this.widthPixels, this.heightPixels);
	};

	public putChar(glyph: Glyph, x: number, y: number): void {
		this.display.putChar(glyph, x, y);
	};

	public render(): void {
		this.display.render(this.ctx!, this.stepx, this.stepy);
	};
};