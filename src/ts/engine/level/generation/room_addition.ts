import { Tile } from "../tile";
import { Rng } from "../../utils/rng";

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

type Result = {
	wallTile: Point,
	direction: Direction;
	tunnelLen: number;
};

class RoomAddition {
	private width: number;
	private height: number;
	private depth: number;
	private tiles: Tile[] = [];
	private rooms: Room[] = [];

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

		/** make first room */
		let room: Room = this.generateRoom();
		room.x = (this.width / 2 - room.width / 2) - 1;
		room.y = (this.height / 2 - room.height / 2) - 1;
		this.placeRoom(room, Tile.FLOOR);

		/** generate the rest */
		for (let i: number = 0; i < this.numTries; ++i) {
			room = this.generateRoom();
			let placedRoom: Result = this.tryPlaceRoom(room);
			if (room.x && room.y) {
				this.placeRoom(room, Tile.FLOOR);
				this.addTunel(placedRoom.wallTile, placedRoom.direction, placedRoom.tunnelLen);
			}
		}
	}

	/** decide the shape of the room */
	private generateRoom(): Room {
		let choice: number = Math.random();

		// if (choice < this.squareRoomChance) {
		// }
		let room: Room = this.generateRoomSquare();

		return room;
	}

	/** make squre room */
	private generateRoomSquare(): Room {
		const minRoomSize = 6;//6;
		const maxRoomSize = 12;//12;

		let room: Room = new Room();
		room.width = Rng.randomInt(Math.round(minRoomSize / 2), Math.round(maxRoomSize / 2)) * 2 + 1;
		room.height = Rng.randomInt(Math.round(minRoomSize / 2), Math.round(maxRoomSize / 2)) * 2 + 1;

		return room;
	}

	private tryPlaceRoom(room: Room): Result {
		for (let i: number = 0; i < this.placeRoomAttempts; ++i) {
			let wallTile: Point | null = null;
			let randomDirInd: number = Rng.randomInt(Direction.cardinal.length);
			let dir: Direction = Direction.cardinal[randomDirInd];

			while (!wallTile) {
				let tileX: number = Rng.randomInt(1, this.width - 2);
				let tileY: number = Rng.randomInt(1, this.height - 2);
				if (this.tiles[(tileX + dir.x) + (tileY + dir.y) * this.width] == Tile.WALL &&
					this.tiles[(tileX - dir.x) + (tileY - dir.y) * this.width] == Tile.FLOOR) {
					wallTile = new Point(tileX, tileY);
				}
			}

			let startRoomX: number | null = null;
			let startRoomY: number | null = null;

			while (!startRoomX && !startRoomY) {
				let x: number = Rng.randomInt(room.width);
				let y: number = Rng.randomInt(room.height);
				//if (this.tiles[x + y * this.width] == Tile.FLOOR) {
				startRoomX = wallTile.x - x;
				startRoomY = wallTile.y - y;
				//}
			}

			for (let i: number = 0; i < this.maxTunnelLength; ++i) {
				let possibleRoomX: number = startRoomX! + dir.x * i;
				let possibleRoomY: number = startRoomY! + dir.y * i;

				let enoughPlace: boolean = this.checkOverlap(possibleRoomX, possibleRoomY, room);

				if (enoughPlace) {
					room.x = possibleRoomX;
					room.y = possibleRoomY;

					return { wallTile: wallTile, direction: dir, tunnelLen: i };
				}
			}
		}
		return { wallTile: new Point(0, 0), direction: Direction.none, tunnelLen: 0 };
	}

	private checkOverlap(roomX: number, roomY: number, room: Room): boolean {
		/** check if inside map */
		if (roomX <= 1 || roomY <= 1 || roomX + room.width > this.width - 1 || roomY + room.height > this.height - 1)
			return false;

		/** check if overlaps */
		for (let x: number = roomX - 1; x < roomX + room.width + 1; ++x) {
			for (let y: number = roomY - 1; y < roomY + room.height + 1; ++y) {
				if (this.tiles[x + y * this.width] !== Tile.WALL && this.tiles[x + y * this.width] !== Tile.DOOR)
					return false; /* the area already used */
				else {
					// for (let dir in Direction.allD) {
					// 	if (this.tiles[(x + room.x + Direction.allD[dir].x) + (y + room.y + Direction.allD[dir].y) * this.width] !== Tile.WALL)
					// 		return false;
					// }
				}

			}
		}

		return true;
	}

	private addTunel(wallTile: Point, dir: Direction, tunnelLen: number): void {
		let startX: number = wallTile.x + dir.x * tunnelLen;
		let startY: number = wallTile.y + dir.y * tunnelLen;

		for (let i: number = 0; i < this.maxTunnelLength; ++i) {
			let x: number = startX - dir.x * i;
			let y: number = startY - dir.y * i;
			this.tiles[x + y * this.width] = Tile.FLOOR;

			if ((x + dir.x) == wallTile.x && (y + dir.y) == wallTile.y)
				break;
		}
	}

	/** add room on the map */
	private placeRoom(room: Room, tile: Tile): void {
		/** add new area */
		for (let x: number = room.x; x < room.x + room.width; ++x) {
			for (let y: number = room.y; y < room.y + room.height; ++y) {
				this.tiles[x + y * this.width] = tile;
			}
		}
		this.rooms.push(room);
	}
}

export { RoomAddition };