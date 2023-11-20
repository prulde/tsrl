import { Position } from "../utils/position";

interface FovLevel {
	blocksLOS(position: Position): boolean;
	reveal(position: Position): boolean;
}

enum Fov {
	RecursiveShadowcasting
}

function computeFov(level: FovLevel, position: Position, range: number, fov: Fov): void {
	switch (fov) {
		case Fov.RecursiveShadowcasting:
			computeFovRecursiveShadowcasting(level, position, range);
			break;

		default:
			break;
	}
}

class Quadrant {
	public readonly sector: number;
	public readonly origin: Position;
	constructor(sector: number, origin: Position) {
		this.sector = sector;
		this.origin = origin;
	}

	public transform(tile: Position): Position {
		if (this.sector == 0) {
			return new Position(this.origin.x + tile.x, this.origin.y - tile.y);
		} else if (this.sector == 2) {
			return new Position(this.origin.x + tile.x, this.origin.y + tile.y);
		} else if (this.sector == 1) {
			return new Position(this.origin.x + tile.y, this.origin.y + tile.x);
		} else {
			return new Position(this.origin.x - tile.y, this.origin.y + tile.x); // west
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

	public rowTiles(): Array<Position> {
		let tiles: Array<Position> = new Array();
		let minCol: number = Math.floor((this.depth * this.startSlope) + 0.5);
		let maxCol: number = Math.ceil((this.depth * this.endSlope) - 0.5);
		for (let x: number = minCol; x < maxCol + 1; ++x) {
			tiles.push(new Position(x, this.depth));
		}
		return tiles;
	}

	public nextRow(): Row {
		return new Row(this.depth + 1, this.startSlope, this.endSlope);
	}
}

function computeFovRecursiveShadowcasting(level: FovLevel, position: Position, range: number): void {
	let radius: number = Math.pow(range, 2);

	level.reveal(Position.from(position));

	for (let i: number = 0; i < 4; ++i) {
		let q: Quadrant = new Quadrant(i, Position.from(position));
		scan(new Row(1, -1.0, 1.0), q, level, range, radius);
	}
}

function scan(row: Row, q: Quadrant, level: FovLevel, range: number, radius: number): void {
	// exclude 1 position perpendicular to player
	if (row.depth > range - 1) {
		return;
	}

	if (row.startSlope >= row.endSlope) {
		return;
	}

	let prevTile: Position | null = null;

	row.rowTiles().forEach((tile: Position): void => {
		if ((Math.pow(tile.x, 2) + Math.pow(tile.y, 2)) > radius) {
			return;
		}

		let currentTileBlocked: boolean = level.blocksLOS(q.transform(tile));

		if (currentTileBlocked || isSymmetric(row, tile)) {
			level.reveal(q.transform(tile));
		}

		if (prevTile) {
			let prevTileBlocked: boolean = level.blocksLOS(q.transform(prevTile));

			if (prevTileBlocked && !currentTileBlocked) {
				row.startSlope = slope(tile, q);
			}
			if (!prevTileBlocked && currentTileBlocked) {
				let nextRow: Row = row.nextRow();
				nextRow.endSlope = slope(tile, q);
				scan(nextRow, q, level, range, radius);
			}
		}
		prevTile = tile;
	});

	if (prevTile) {
		let prevTileBlocked: boolean = level.blocksLOS(q.transform(prevTile));
		if (!prevTileBlocked) {
			scan(row.nextRow(), q, level, range, radius);
		}
	}
}

function slope(tile: Position, q: Quadrant): number {
	return ((2 * tile.x - 1) / (2 * tile.y));
}

function isSymmetric(row: Row, tile: Position): boolean {
	return ((tile.x >= row.depth * row.startSlope) && (tile.x <= row.depth * row.endSlope));
}

export { FovLevel, Fov, computeFov };