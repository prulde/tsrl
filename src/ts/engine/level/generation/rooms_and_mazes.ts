import { Tile } from "../tile";
import { Prefab } from "./prefabs";

class Rect {
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

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

	public static northWest: Direction = new Direction(-1, -1);
	public static northEast: Direction = new Direction(1, -1);
	public static southWest: Direction = new Direction(-1, 1);
	public static southEast: Direction = new Direction(1, 1);
	public static cardinal: Direction[] = [this.north, this.south, this.west, this.east];
	public static allD: Direction[] = [this.north, this.south, this.west, this.east,
	this.northEast, this.northWest, this.southEast, this.southWest];

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

}

class Room {
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	//public connectedDirs: Set<Direction> = new Set<Direction>();
	//public adjusted: Map<Direction, boolean> = new Map<Direction, boolean>();
	constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

// class Crypt {
// 	private width: number;
// 	private height: number;
// 	private depth: number;
// 	private tiles: Tile[] = [];
// 	private rooms: Rect[] = [];
// 	private exits: Rect[] = [];

// 	constructor(width: number, height: number, tiles: Tile[], depth: number) {
// 		this.width = width;
// 		this.height = height;
// 		this.tiles = tiles;
// 		this.depth = depth;
// 	}

// 	public makeCrypt(maxRooms: number): void {
// 		if (!this.makeRoom(Math.floor(this.width / 2),
// 			Math.floor(this.height / 2), this.randomInt(4), true)) {
// 			console.log("unable to place the first room");
// 			return;
// 		}

// 		// we already placed 1 feature (the first room)
// 		for (let i: number = 1; i < maxRooms; ++i) {
// 			if (!this.createFeatures()) {
// 				console.log(`Unable to place more features (placed ${i})`);
// 				break;
// 			}
// 		}

// 		// if (!this.placeObject(UpStairs)) {
// 		// 	console.log("Unable to place up stairs");
// 		// 	return;
// 		// }

// 		// if (!this.placeObject(DownStairs)) {
// 		// 	console.log("Unable to place down stairs");
// 		// 	return;
// 		// }

// 		// for (char & tile : _tiles)
// 		// {
// 		// 	if (tile == Unused)
// 		// 		tile = '.';
// 		// 	else if (tile == Floor || tile == Corridor)
// 		// 		tile = ' ';
// 		// }
// 	}

// 	private randomIntFromInterval(min: number, max: number): number {
// 		return Math.floor(Math.random() * (max - min + 1) + min);
// 	}

// 	private randomInt(exclusiveMax: number): number {
// 		return Math.floor(Math.random() * (exclusiveMax - 1));
// 	}

// 	private randomBoolean(probability: number = 0.5): boolean {
// 		return (Math.random() > probability);
// 	}

// 	private createFeatures(): boolean {
// 		for (let i: number = 0; i < 1000; ++i) {
// 			if (this.exits.length == 0)
// 				break;

// 			// choose a random side of a random room or corridor
// 			let r: number = this.randomInt(this.exits.length);
// 			let x: number = this.randomIntFromInterval(this.exits[r].x, this.exits[r].x + this.exits[r].width - 1);
// 			let y: number = this.randomIntFromInterval(this.exits[r].y, this.exits[r].y + this.exits[r].height - 1);

// 			// north, south, west, east
// 			for (let j: number = 0; j < 4; ++j) {
// 				if (this.createFeature(x, y, j)) {
// 					this.exits.slice(r, 1);
// 					return true;
// 				}
// 			}
// 		}

// 		return false;
// 	}

// 	private createFeature(x: number, y: number, dir: number): boolean {
// 		const roomChance: number = 100; // corridorChance = 100 - roomChance

// 		let dx: number = 0;
// 		let dy: number = 0;

// 		if (dir == Direction.North)
// 			dy = 1;
// 		else if (dir == Direction.South)
// 			dy = -1;
// 		else if (dir == Direction.West)
// 			dx = 1;
// 		else if (dir == Direction.East)
// 			dx = -1;

// 		if (this.tiles[(x + dx) + (y + dy) * this.width] != Tile.FLOOR &&
// 			this.tiles[(x + dx) + (y + dy) * this.width] != Tile.BOUND)
// 			return false;

// 		if (this.randomInt(100) < roomChance) {
// 			if (this.makeRoom(x, y, dir)) {
// 				this.tiles[x + y * this.width] = Tile.DOOR;

// 				return true;
// 			}
// 		}

// 		else {
// 			if (this.makeCorridor(x, y, dir)) {
// 				if (this.tiles[(x + dx) + (y + dy) * this.width] == Tile.FLOOR)
// 					this.tiles[x + y * this.width] = Tile.DOOR;
// 				else // don't place a door between corridors
// 					this.tiles[x + y * this.width] = Tile.CORRIDOR;

// 				return true;
// 			}
// 		}

// 		return false;
// 	}

// 	private makeRoom(x: number, y: number, dir: number, firstRoom: boolean = false): boolean {
// 		const minRoomSize = 5;
// 		const maxRoomSize = 10;

// 		let room: Rect = new Rect();
// 		room.width = this.randomIntFromInterval(minRoomSize, maxRoomSize);
// 		room.height = this.randomIntFromInterval(minRoomSize, maxRoomSize);

// 		if (dir == Direction.North) {
// 			room.x = Math.floor(x - room.width / 2);
// 			room.y = Math.floor(y - room.height);
// 		}

// 		else if (dir == Direction.South) {
// 			room.x = Math.floor(x - room.width / 2);
// 			room.y = Math.floor(y + 1);
// 		}

// 		else if (dir == Direction.West) {
// 			room.x = Math.floor(x - room.width);
// 			room.y = Math.floor(y - room.height / 2);
// 		}

// 		else if (dir == Direction.East) {
// 			room.x = x + 1;
// 			room.y = Math.floor(y - room.height / 2);
// 		}

// 		if (this.placeRect(room, Tile.FLOOR)) {
// 			this.rooms.push(room);

// 			if (dir != Direction.South || firstRoom) // north side
// 				this.exits.push(new Rect(room.x, room.y - 1, room.width, 1));
// 			if (dir != Direction.North || firstRoom) // south side
// 				this.exits.push(new Rect(room.x, room.y + room.height, room.width, 1));
// 			if (dir != Direction.East || firstRoom) // west side
// 				this.exits.push(new Rect(room.x - 1, room.y, 1, room.height));
// 			if (dir != Direction.West || firstRoom) // east side
// 				this.exits.push(new Rect(room.x + room.width, room.y, 1, room.height));

// 			return true;
// 		}

// 		return false;
// 	}

// 	private makeCorridor(x: number, y: number, dir: number): boolean {
// 		const minCorridorLength: number = 3;
// 		const maxCorridorLength: number = 6;

// 		let corridor: Rect = new Rect();
// 		corridor.x = x;
// 		corridor.y = y;

// 		if (this.randomBoolean()) // horizontal corridor
// 		{
// 			corridor.width = this.randomIntFromInterval(minCorridorLength, maxCorridorLength);
// 			corridor.height = 1;

// 			if (dir == Direction.North) {
// 				corridor.y = y - 1;

// 				if (this.randomBoolean()) // west
// 					corridor.x = x - corridor.width + 1;
// 			}

// 			else if (dir == Direction.South) {
// 				corridor.y = y + 1;

// 				if (this.randomBoolean()) // west
// 					corridor.x = x - corridor.width + 1;
// 			}

// 			else if (dir == Direction.West)
// 				corridor.x = x - corridor.width;

// 			else if (dir == Direction.East)
// 				corridor.x = x + 1;
// 		}

// 		else // vertical corridor
// 		{
// 			corridor.width = 1;
// 			corridor.height = this.randomIntFromInterval(minCorridorLength, maxCorridorLength);

// 			if (dir == Direction.North)
// 				corridor.y = y - corridor.height;

// 			else if (dir == Direction.South)
// 				corridor.y = y + 1;

// 			else if (dir == Direction.West) {
// 				corridor.x = x - 1;

// 				if (this.randomBoolean()) // north
// 					corridor.y = y - corridor.height + 1;
// 			}

// 			else if (dir == Direction.East) {
// 				corridor.x = x + 1;

// 				if (this.randomBoolean()) // north
// 					corridor.y = y - corridor.height + 1;
// 			}
// 		}

// 		if (this.placeRect(corridor, Tile.CORRIDOR)) {
// 			if (dir != Direction.South && corridor.width != 1) // north side
// 				this.exits.push(new Rect(corridor.x, corridor.y - 1, corridor.width, 1));
// 			if (dir != Direction.North && corridor.width != 1) // south side
// 				this.exits.push(new Rect(corridor.x, corridor.y + corridor.height, corridor.width, 1));
// 			if (dir != Direction.East && corridor.height != 1) // west side
// 				this.exits.push(new Rect(corridor.x - 1, corridor.y, 1, corridor.height));
// 			if (dir != Direction.West && corridor.height != 1) // east side
// 				this.exits.push(new Rect(corridor.x + corridor.width, corridor.y, 1, corridor.height));

// 			return true;
// 		}

// 		return false;
// 	}

// 	private placeRect(rect: Rect, tile: Tile): boolean {
// 		if (rect.x <= 1 || rect.x <= 1 ||
// 			rect.x > this.width - rect.width - 1 || rect.y > this.height - rect.height - 1) {

// 		}
// 		if (rect.x < 1 || rect.y < 1 || rect.x + rect.width > this.width - 1 || rect.y + rect.height > this.height - 1)
// 			return false;

// 		/**
// 		 * check if new area overlaps existing area
// 		 */
// 		for (let x: number = rect.x; x < rect.x + rect.width; ++x) {
// 			for (let y: number = rect.y; y < rect.y + rect.height; ++y) {
// 				if (this.tiles[x + y * this.width] !== Tile.GRASS)
// 					return false; // the area already used
// 			}
// 		}

// 		/**
// 		 * add new area
// 		 */
// 		for (let x: number = rect.x - 1; x < rect.x + rect.width + 1; ++x) {
// 			for (let y: number = rect.y - 1; y < rect.y + rect.height + 1; ++y) {
// 				if (x == rect.x - 1 || y == rect.y - 1 || x == rect.x + rect.width || y == rect.y + rect.height)
// 					this.tiles[x + y * this.width] = Tile.WALL;
// 				else
// 					this.tiles[x + y * this.width] = tile;
// 			}
// 		}
// 		return true;
// 	}

// 	private placeObject(tile: Tile): boolean {
// 		if (this.rooms.length == 0)
// 			return false;

// 		let r: number = this.randomInt(this.rooms.length); // choose a random room
// 		let x: number = this.randomIntFromInterval(this.rooms[r].x + 1, this.rooms[r].x + this.rooms[r].width - 2);
// 		let y: number = this.randomIntFromInterval(this.rooms[r].y + 1, this.rooms[r].y + this.rooms[r].height - 2);

// 		if (this.tiles[x + y * (this.width)] == Tile.FLOOR) {
// 			this.tiles[x + y * (this.width)] = tile;

// 			// place one object in one room (optional)
// 			this.rooms.slice(r, 1);

// 			return true;
// 		}

// 		return false;
// 	}

// 	private addRoom(x1: number, y1: number, x2: number, y2: number): void {
// 		if (x1 <= 0 || y1 <= 0 || x1 > this.width - 5 || y1 > this.height - 5) {
// 			return;
// 		}
// 	}
// }

class RoomsAndMazes {
	private width: number;
	private height: number;
	private depth: number;
	private tiles: Tile[] = [];
	private rooms: Room[] = [];

	private numTries: number = 1000;
	private windingPercent: number = 0.5;
	private currenRegion: number = 0;
	private regions: number[] = [];

	constructor(width: number, height: number, tiles: Tile[], depth: number) {
		this.width = width;
		this.height = height;
		this.tiles = tiles;
		this.depth = depth;
		this.regions = new Array(width * height);
	}

	public generate(): void {
		this.placeRooms();

		for (let y: number = 1; y < this.height; y += 2) {
			for (let x: number = 1; x < this.width; x += 2) {
				if (this.tiles[x + y * this.width] != Tile.WALL) continue;
				this.growMaze(new Point(x, y));
			}
		}

		this.connectRegions();
		this.removeDeadEnds();
	}

	private placeRooms(): boolean {
		const minRoomSize = 4;//6;
		const maxRoomSize = 8;//12;

		for (let i: number = 0; i < this.numTries; ++i) {
			let room: Room = new Room();
			room.width = this.randomIntFromInterval(Math.round(minRoomSize / 2), Math.round(maxRoomSize / 2)) * 2 + 1;
			room.height = this.randomIntFromInterval(Math.round(minRoomSize / 2), Math.round(maxRoomSize / 2)) * 2 + 1;

			room.x = Math.round(this.randomInt((this.width - room.width - 1) / 2) * 2 + 1);
			room.y = Math.round(this.randomInt((this.height - room.height - 1) / 2) * 2 + 1);

			if (this.canPlace(room)) {
				//this.placeRoom(room, Tile.FLOOR);
				this.currenRegion++;
				for (let x: number = room.x; x < room.x + room.width; ++x) {
					for (let y: number = room.y; y < room.y + room.height; ++y) {
						this.carve(new Point(x, y), Tile.FLOOR);
					}
				}

				this.rooms.push(room);

			} else {
				continue;
			}
		}

		return false;
	}

	private growMaze(start: Point): void {
		let cells: Point[] = [];
		let lastDir: Direction = Direction.none;

		this.currenRegion++;
		this.carve(start, Tile.FLOOR);

		cells.push(start);

		while (cells.length) {
			let cell: Point = cells[cells.length - 1];
			let unmadeCells: Direction[] = [];

			/** north, south, west, east */
			for (let dir in Direction.cardinal) {
				if (this.canCarve(cell, Direction.cardinal[dir])) {
					unmadeCells.push(Direction.cardinal[dir]);
				}
			}

			if (unmadeCells.length) {
				let dir!: Direction;
				unmadeCells.forEach((c: Direction): void => {
					if (c == lastDir && (Math.random() > 0.5)) {
						dir = lastDir;
					} else {
						/**  for more straight paths */
						//dir = unmadeCells.pop()!;
						dir = unmadeCells[this.randomInt(unmadeCells.length)];
					}
				});

				let newCell: Point = new Point(cell.x + dir.x, cell.y + dir.y);
				this.carve(newCell, Tile.FLOOR);
				newCell = new Point(cell.x + dir.x * 2, cell.y + dir.y * 2);
				this.carve(newCell, Tile.FLOOR);

				cells.push(newCell);
				lastDir = dir;
			} else {
				cells.pop();
				lastDir = Direction.none;
			}
		}
	}

	private connectRegions(): void {
		let connectorRegions: Map<Point, Set<number>> = new Map();
		for (let x: number = 1; x < this.width - 1; ++x) {
			for (let y: number = 1; y < this.height - 1; ++y) {
				if (this.tiles[x + y * this.width] != Tile.WALL) {
					continue;
				}

				let newRegions: Set<number> = new Set();

				/** north, south, west, east */
				for (let dir in Direction.cardinal) {
					let newX: number = x + Direction.cardinal[dir].x;
					let newY: number = y + Direction.cardinal[dir].y;
					let region: number = this.regions[newX + newY * this.width];
					if (region) newRegions.add(region);
				}

				if (newRegions.size < 2) continue;

				connectorRegions.set(new Point(x, y), newRegions);
			}
		}

		let connectors: Point[] = [];
		// for (let x: number = 0; x < this.width; ++x) {
		// 	for (let y: number = 0; y < this.height; ++y) {
		// 		let point: Point = new Point(x, y);
		// 		if (connectorRegions.has(new Point(x, y))) {
		// 			connectors.push(new Point(x, y));
		// 		}
		// 	}
		// }

		connectors = Array.from(connectorRegions.keys());

		let merged: number[] = [];
		let openRegions: Set<number> = new Set<number>();
		for (let i: number = 0; i < this.currenRegion + 1; ++i) {
			merged[i] = i;
			openRegions.add(i);
		}

		let doorNum: number = 0;
		while (openRegions.size > 1) {
			let connector: Point = connectors[this.randomInt(connectors.length)];

			if (doorNum >= 3) {

			} else
				this.addJunction(connector);

			let x: number = connector.x;
			let y: number = connector.y;
			let newRegions: number[] = [];

			connectorRegions.get(connector)?.forEach((n: number): void => {
				newRegions.push(merged[n]);
			});

			// for (let key of connectorRegions) {
			// 	if (key[0].x == x && key[0].y == y) {
			// 		newRegions.push(merged[key[1]]);
			// 	}
			// }

			let dest: number = newRegions[0];
			newRegions.shift();
			let sources: number[] = newRegions.map((obj: number): number => { return obj; });

			for (let i: number = 0; i < this.currenRegion + 1; ++i) {
				sources.forEach((source: number): void => {
					if (source == merged[i]) {
						merged[i] = dest;
					}
				});
			}

			sources.forEach((source: number): void => {
				if (openRegions.has(source)) {
					openRegions.delete(source);
				}
			});

			let toBeRemoved: Set<Point> = new Set();
			connectors.forEach((pos: Point): void => {
				if (Math.sqrt(Math.pow(connector.x - pos.x, 2) + Math.pow(connector.y - pos.y, 2)) < 2) {
					toBeRemoved.add(pos);
					return;
				}

				let regs: Set<number>;
				let x: number = pos.x;
				let y: number = pos.y;
				connectorRegions.get(pos)?.forEach((n: number): void => {
					newRegions.push(merged[n]);
				});

				if (newRegions.length > 1) {
					return;
				}

				// if (Math.random() < 0.04) {
				// 	this.addJunction(pos);
				// }

				if (newRegions.length == 1) {
					toBeRemoved.add(pos);
				}
			});
		}
	}

	private removeDeadEnds(): void {
		let done: boolean = false;

		while (!done) {
			done = true;
			for (let x: number = 1; x < this.width; ++x) {
				for (let y: number = 1; y < this.height; ++y) {
					if (this.tiles[x + y * this.width] == Tile.WALL)
						continue;
					let exits: number = 0;
					for (let dir in Direction.cardinal) {
						if (this.tiles[(x + Direction.cardinal[dir].x) + (y + Direction.cardinal[dir].y) * this.width] != Tile.WALL) {
							exits++;
						}
					}
					if (exits != 1) {
						continue;
					}

					done = false;
					this.tiles[x + y * this.width] = Tile.WALL;
				}
			}
		}
	}

	private addJunction(pos: Point): void {
		this.tiles[pos.x + pos.y * this.width] = Tile.DOOR;
	}

	private canCarve(pos: Point, dir: Direction): boolean {
		let x: number = pos.x + dir.x * 3;
		let y: number = pos.y + dir.y * 3;

		if (!(0 <= x && x < this.width) || !(0 <= y && y < this.height)) {
			return false;
		}

		x = pos.x + dir.x * 2;
		y = pos.y + dir.y * 2;
		return this.tiles[x + y * this.width] === Tile.WALL;
	}

	private canPlace(room: Room): boolean {
		/** check if inside map */
		if (room.x <= 1 || room.y <= 1 || room.x + room.width > this.width - 1 || room.y + room.height > this.height - 1)
			return false;

		/** check if overlaps */
		for (let x: number = room.x - 1; x < room.x + room.width + 1; ++x) {
			for (let y: number = room.y - 1; y < room.y + room.height + 1; ++y) {
				if (this.tiles[x + y * this.width] !== Tile.WALL && this.tiles[x + y * this.width] !== Tile.DOOR)
					return false; /* the area already used */
			}
		}

		return true;
	}

	private carve(pos: Point, tile: Tile): void {
		this.regions[pos.x + pos.y * this.width] = this.currenRegion;
		this.tiles[pos.x + pos.y * this.width] = tile;
	}

	private placeRoom(room: Room, tile: Tile): void {
		/** add new area */
		for (let x: number = room.x; x < room.x + room.width; ++x) {
			for (let y: number = room.y; y < room.y + room.height; ++y) {
				this.tiles[x + y * this.width] = tile;
			}
		}
	}

	private randomIntFromInterval(min: number, max: number): number {
		return Math.round(Math.random() * (max - min + 1) + min);
	}

	private randomInt(exclusiveMax: number): number {
		return Math.round(Math.random() * (exclusiveMax - 1));
	}

	private randomBoolean(probability: number = 0.5): boolean {
		return (Math.random() > probability);
	}

	private placeObject(tile: Tile): boolean {
		if (this.rooms.length == 0)
			return false;

		let r: number = this.randomInt(this.rooms.length); // choose a random room
		let x: number = this.randomIntFromInterval(this.rooms[r].x + 1, this.rooms[r].x + this.rooms[r].width - 2);
		let y: number = this.randomIntFromInterval(this.rooms[r].y + 1, this.rooms[r].y + this.rooms[r].height - 2);

		if (this.tiles[x + y * (this.width)] == Tile.FLOOR) {
			this.tiles[x + y * (this.width)] = tile;

			// place one object in one room (optional)
			this.rooms.slice(r, 1);

			return true;
		}

		return false;
	}
}

export { RoomsAndMazes };