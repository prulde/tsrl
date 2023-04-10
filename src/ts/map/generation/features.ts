import Tile from "../tile";
import Rng from "../../utils/rng";

class Point {
	public x: number;
	public y: number;
	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}
}

class Direction {
	public x: number;
	public y: number;

	public static north: Direction = new Direction(0, -1);
	public static south: Direction = new Direction(0, 1);
	public static west: Direction = new Direction(-1, 0);
	public static east: Direction = new Direction(1, 0);
	public static none: Direction = new Direction(0, 0);

	public static cardinal: Direction[] = [this.north, this.south, this.west, this.east];

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

enum AreaType {
	none = 0,
	room = 1,
	corridor = 2
}

class Mark {
	public x: number;
	public y: number;
	public dir: Direction;
	public masterArea: AreaType;
	public forcedNextArea: AreaType = AreaType.none;
	public corridorEnd: boolean = false;

	constructor(x: number, y: number, dir: Direction, masterArea: AreaType) {
		this.x = x;
		this.y = y;
		this.dir = dir;
		this.masterArea = masterArea;
	}
}

class Room {
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	public areaType: AreaType = AreaType.none;
	public exits: Mark[] = [];

	constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

export default class FeatureBuilder {
	private width: number;
	private height: number;
	private depth: number;
	private tiles: Tile[] = [];

	/** general number of rooms */
	private rooms: Room[] = [];

	/** rooms with unused exits */
	private roomsWithExits: Room[] = [];

	private numTries: number = 1000;
	private placeRoomAttempts: number = 20;
	private squareRoomChance: number = 0.2;
	private maxTunnelLength: number = 12;

	constructor(width: number, height: number, tiles: Tile[], depth: number) {
		this.width = width;
		this.height = height;
		this.tiles = tiles;
		this.depth = depth;
	}

	public generate(): void {
		this.initWithTiles(Tile.TEST_FLOOR);

	}

	private initWithTiles(tile: Tile): void {
		for (let i: number = 0; i < this.width; i++) {
			for (let j: number = 0; j < this.height; j++) {
				this.tiles[i + j * this.width] = tile;
			}
		}
	}
}