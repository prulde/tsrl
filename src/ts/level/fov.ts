import Level from "./level";

class Point {
	public readonly x: number;
	public readonly y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

class Quadrant {
	public readonly sector: number;
	public readonly origin: Point;
	constructor(sector: number, origin: Point) {
		this.sector = sector;
		this.origin = origin;
	}

	public transfom(tile: Point): Point {
		if (this.sector == 0) {
			return new Point(this.origin.x + tile.x, this.origin.y - tile.y);
		} else if (this.sector == 2) {
			return new Point(this.origin.x + tile.x, this.origin.y + tile.y);
		} else if (this.sector == 1) {
			return new Point(this.origin.x + tile.y, this.origin.y + tile.x);
		} else {
			return new Point(this.origin.x - tile.y, this.origin.y + tile.x); // west
		}
	}
}

class Row {
	public readonly depth: number;
	public startSlope: number;
	public endSlope: number;

	constructor(depth: number, startSlope: number, endSlope: number) {
		this.depth = depth;
		this.startSlope = startSlope;
		this.endSlope = endSlope;
	}

	public rowTiles(): Array<Point> {
		let tiles: Array<Point> = new Array();
		let minCol: number = Math.floor((this.depth * this.startSlope) + 0.5);
		let maxCol: number = Math.ceil((this.depth * this.endSlope) - 0.5);
		for (let x: number = minCol; x < maxCol + 1; ++x) {
			tiles.push(new Point(x, this.depth));
		}
		return tiles;
	}

	public nextRow(): Row {
		return new Row(this.depth + 1, this.startSlope, this.endSlope);
	}
}

export default class Fov {
	private _inFov: Array<Point>;
	private _range: number;
	private _radius: number;
	private _level: Level;

	constructor(level: Level, range: number) {
		this._level = level;
		this._inFov = new Array<Point>();
		this._range = range;
		this._radius = this._range * this._range;
	}

	public isInFov(x: number, y: number): boolean {
		if (!this._level.isInsideMap(x, y)) {
			return false;
		}
		let value: boolean = false;
		this._inFov.forEach((p: Point): void => {
			if (p.x == x && p.y == y) {
				value = true;
				return;
			}
		});
		return value;
	}

	public computeFov(x: number, y: number): void {
		this._inFov = [];
		this._inFov.push(new Point(x, y));

		for (let i: number = 0; i < 4; ++i) {
			let q: Quadrant = new Quadrant(i, new Point(x, y));
			this.scan(new Row(1, -1.0, 1.0), q);
		}
	}

	private scan(row: Row, q: Quadrant): void {
		// exclude 1 point perpendicular to player
		if (row.depth > this._range - 1) {
			return;
		}

		if (row.startSlope >= row.endSlope) {
			return;
		}

		let prevTile: Point | null = null;

		row.rowTiles().forEach((tile: Point): void => {
			if ((Math.pow(tile.x, 2) + Math.pow(tile.y, 2)) > this._radius) {
				return;
			}

			if (this.blocksSight(tile, q) || this.isSymmetric(row, tile)) {
				this.reveal(tile, q);
			}
			if (prevTile) {
				if (this.blocksSight(prevTile, q) && !this.blocksSight(tile, q)) {
					row.startSlope = this.slope(tile, q);
				}
				if (!this.blocksSight(prevTile, q) && this.blocksSight(tile, q)) {
					let nextRow: Row = row.nextRow();
					nextRow.endSlope = this.slope(tile, q);
					this.scan(nextRow, q);
				}
			}
			prevTile = tile;
		});

		if (prevTile) {
			if (!this.blocksSight(prevTile, q)) {
				this.scan(row.nextRow(), q);
			}
		}
	}

	private reveal(tile: Point, q: Quadrant): void {
		let converted: Point = q.transfom(tile);
		let revealed: boolean = this._level.reveal(converted.x, converted.y);
		if (!revealed) {
			return;
		}
		this._inFov.push(new Point(converted.x, converted.y));
	}

	private blocksSight(tile: Point, q: Quadrant): boolean {
		let converted: Point = q.transfom(tile);
		return this._level.blocks(converted.x, converted.y);
	}

	private slope(tile: Point, q: Quadrant): number {
		return ((2 * tile.x - 1) / (2 * tile.y));
	}

	private isSymmetric(row: Row, tile: Point): boolean {
		return ((tile.x >= row.depth * row.startSlope) && (tile.x <= row.depth * row.endSlope));
	}
}