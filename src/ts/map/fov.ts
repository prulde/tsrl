import GameMap from "./map";

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
	private width: number;
	private height: number;
	private inFov: Array<Point>;
	private explored: boolean[];
	private range: number;
	private radius: number;
	private map: GameMap;

	constructor(width: number, height: number, map: GameMap) {
		this.width = width;
		this.height = height;
		this.inFov = new Array<Point>();
		this.explored = new Array(width * height);
		this.range = 10;
		this.radius = this.range * this.range;
		this.map = map;

		this.explored.fill(false);
	}

	public isInFov(x: number, y: number): boolean {
		let value: boolean = false;
		this.inFov.forEach((p: Point): void => {
			if (p.x == x && p.y == y) {
				value = true;
				return;
			}
		});
		return value;
	}

	public isExplored(x: number, y: number): boolean {
		return this.explored[x + y * this.width];
	}

	public computeFov(x: number, y: number): void {
		this.inFov = [];
		this.inFov.push(new Point(x, y));

		for (let i: number = 0; i < 4; ++i) {
			let q: Quadrant = new Quadrant(i, new Point(x, y));
			this.scan(new Row(1, -1.0, 1.0), q);
		}
	}

	private scan(row: Row, q: Quadrant): void {
		// exclude 1 point perpendicular to player
		if (row.depth > this.range - 1) {
			return;
		}

		if (row.startSlope >= row.endSlope) {
			return;
		}

		let prevTile: Point | null = null;

		row.rowTiles().forEach((tile: Point): void => {
			if ((Math.pow(tile.x, 2) + Math.pow(tile.y, 2)) > this.radius) {
				return;
			}

			if (this.isWall(tile, q) || this.isSymmetric(row, tile)) {
				this.reveal(tile, q);
			}
			if (prevTile) {
				if (this.isWall(prevTile, q) && !this.isWall(tile, q)) {
					row.startSlope = this.slope(tile, q);
				}
				if (!this.isWall(prevTile, q) && this.isWall(tile, q)) {
					let nextRow: Row = row.nextRow();
					nextRow.endSlope = this.slope(tile, q);
					this.scan(nextRow, q);
				}
			}
			prevTile = tile;
		});

		if (prevTile) {
			if (!this.isWall(prevTile, q)) {
				this.scan(row.nextRow(), q);
			}
		}
	}

	private reveal(tile: Point, q: Quadrant): void {
		let converted: Point = q.transfom(tile);
		if (!this.map.isInsideMap(converted.x, converted.y)) {
			return;
		}
		this.inFov.push(new Point(converted.x, converted.y));
		this.explored[converted.x + converted.y * this.width] = true;
	}

	private isWall(tile: Point, q: Quadrant): boolean {
		let converted: Point = q.transfom(tile);
		if (!this.map.isInsideMap(converted.x, converted.y)) {
			return true; // Tile.BOUNDS
		}
		return this.map.isWall(converted.x, converted.y);
	}

	private slope(tile: Point, q: Quadrant): number {
		return ((2 * tile.x - 1) / (2 * tile.y));
	}

	private isSymmetric(row: Row, tile: Point): boolean {
		return ((tile.x >= row.depth * row.startSlope) && (tile.x <= row.depth * row.endSlope));
	}
}