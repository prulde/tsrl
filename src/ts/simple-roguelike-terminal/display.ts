import { Glyph } from "./glyph";

export default class Display {
	private width;
	private height;
	private glyphs: Glyph[] = [];
	private changedGlyphs: (Glyph | null)[] = [];

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	};

	public putChar(glyph: Glyph, x: number, y: number): void {
		if (x < 0) return;
		if (x >= this.width) return;
		if (y < 0) return;
		if (y >= this.height) return;

		this.changedGlyphs[x + y * this.width] = glyph;
	};

	public render(ctx: CanvasRenderingContext2D, stepx: number, stepy: number): void {
		let count: number = 0;
		for (let x: number = 0; x < this.width; ++x) {
			for (let y: number = 0; y < this.height; ++y) {
				let glyph: Glyph | null = this.changedGlyphs[x + y * this.width];
				if (glyph === null || glyph === undefined) continue;
				if (this.changedGlyphs[x + y * this.width] == this.glyphs[x + y * this.width]) continue;
				count++;

				ctx!.putImageData(glyph.data, x * stepx, y * stepy);

				this.glyphs[x + y * this.width] = glyph;
				this.changedGlyphs[x + y * this.width] = null;
			};
		};
		console.log(`number of calls to putImageData(): ${count}`);
	};
};