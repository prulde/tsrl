import Glyph from "./glyph";

export default class Display {
	private width: number;
	private height: number;

	private stepx: number;
	private stepy: number;

	private ctx: CanvasRenderingContext2D;

	private glyphs: Glyph[] = [];
	private changedGlyphs: (Glyph | null)[] = [];

	constructor(width: number, height: number, stepx: number, stepy: number, ctx: CanvasRenderingContext2D) {
		this.width = width;
		this.height = height;
		this.stepx = stepx;
		this.stepy = stepy;
		this.ctx = ctx;
	}

	public putChar(glyph: Glyph, x: number, y: number): void {
		if (x < 0) return;
		if (x >= this.width) return;
		if (y < 0) return;
		if (y >= this.height) return;

		this.changedGlyphs[x + y * this.width] = glyph;
	}

	public render(): void {
		//let count: number = 0;
		for (let x: number = 0; x < this.width; ++x) {
			for (let y: number = 0; y < this.height; ++y) {
				let glyph: Glyph | null = this.changedGlyphs[x + y * this.width];
				if (glyph === null || glyph === undefined) continue;
				if (this.changedGlyphs[x + y * this.width] == this.glyphs[x + y * this.width]) continue;
				//count++;

				this.ctx!.putImageData(glyph.glyphData, x * this.stepx, y * this.stepy);

				this.glyphs[x + y * this.width] = glyph;
				this.changedGlyphs[x + y * this.width] = null;
			}
		}
		//count == 0 ? "" : console.log(`number of calls to putImageData(): ${count}`);
	}
}