import Tile from "../tile";
import Rng from "../../utils/rng";

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

class AreaType {
	public static none: string = "none";
	public static room: string = "room";
	public static corridor: string = "corridor";

	public static types: string[] = [this.room, this.corridor];
}

class Mark {
	public x: number;
	public y: number;
	public dir: Direction;
	public forcedNextAreaType: AreaType = AreaType.none;
	public corridorEnd: boolean = false;
	public masterAreaType: AreaType;

	constructor(x: number, y: number, dir: Direction, masterAreaType: AreaType) {
		this.x = x;
		this.y = y;
		this.dir = dir;
		this.masterAreaType = masterAreaType;
	}
}

class Room {
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	public floorTiles: number[] = [];
	public areaType: AreaType = AreaType.none;
	public exits: Mark[] = [];
	public sameTypeForced: boolean = false;

	constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

class DungeonSettings {
	public chance: Map<AreaType, number>;
	public seq: Map<AreaType, number>; // chance to at least 1 extra area of the same type 
	public max: Map<AreaType, number>;

	constructor(params: { chance: number, seq: number, max: number; }[]) {
		let tempMap: Map<AreaType, number> = new Map();
		this.seq = new Map();
		this.max = new Map();

		for (let i in params) {
			tempMap.set(AreaType.types[i], params[i].chance);
			this.seq.set(AreaType.types[i], params[i].seq);
			this.max.set(AreaType.types[i], params[i].max);
		}

		this.chance = new Map([...tempMap.entries()]
			.sort((a: [AreaType, number], b: [AreaType, number]): number => a[1] - b[1]));
	}
}

export default class FeatureBuilder {
	private width: number;
	private height: number;
	private depth: number;
	private tiles: Tile[] = [];
	private settings: DungeonSettings;

	private rooms: Room[] = [];
	private unusedExits: Mark[] = [];

	private placeRoomAttempts: number = 500;
	private resizeAndPlaceAttempts: number = 10;
	private maxRooms: number = 50;

	constructor(width: number, height: number, tiles: Tile[], depth: number) {
		this.width = width;
		this.height = height;
		this.tiles = tiles;
		this.depth = depth;
		this.settings = new DungeonSettings([
			{ chance: 1.0, seq: 0.0, max: 0 },
			{ chance: 0.0, seq: 0.0, max: 0 }
		]);
	}

	public generate(): void {

		// fill the map with walls
		this.initWithTiles(Tile.WALL);

		// make first room 
		this.makeFirstRoom();
		this.maxRooms--;

		// let room: boolean = this.makeRectRoom(true);
		// room.x = (Math.round(this.width / 2 - room.width / 2)) - 1;
		// room.y = (Math.round(this.height / 2 - room.height / 2)) - 1;
		// this.addForcedType(room);
		// this.placeRoom(room, Tile.TEST_FLOOR);

		for (let i: number = 0; i < this.maxRooms; ++i) {
			if (!this.createFeatures()) {
				console.log("cant make more rooms");
				break;
			}
		}

		this.rooms.forEach((room: Room): void => {
			room.exits.forEach((exit: Mark): void => {
				this.tiles[exit.x + exit.y * this.width] = Tile.TEST_DOOR;
			});
		});

		this.unusedExits.forEach((exit) => {
			this.tiles[exit.x + exit.y * this.width] = Tile.DOOR;
		});

	}

	// decide the shape of the room 
	private createFeatures(): boolean {
		for (let i: number = 0; i < this.placeRoomAttempts; ++i) {
			let choice: number = Math.random();

			// pick random exit 
			if (!this.unusedExits.length)
				return false;

			let exitInd: number = Rng.randomInt(this.unusedExits.length);
			let randomExit: Mark = this.unusedExits[exitInd];

			// use forced area type if not null
			if (randomExit.forcedNextAreaType != AreaType.none) {
				// remove used exit from list
				this.unusedExits.splice(exitInd, 1);
				for (let j: number = 0; j < this.resizeAndPlaceAttempts; ++j)
					if (this.createRoomByType(randomExit.forcedNextAreaType, randomExit))
						return true;

			} else {
				// create random shape
				for (let [areaType, chance] of this.settings.chance) {
					choice -= chance;
					if (choice <= 0) {
						// remove used exit from list
						this.unusedExits.splice(exitInd, 1);
						for (let j: number = 0; j < this.resizeAndPlaceAttempts; ++j)
							if (this.createRoomByType(areaType, randomExit))
								return true;
					}
				}
			}
		}

		// could not make room
		return false;
	}

	private makeFirstRoom(): void {
		const minRoomSize = 6;//6;
		const maxRoomSize = 12;//12;

		let room: Room = new Room();
		room.areaType = AreaType.room;

		room.width = Rng.randomInt(Math.round(minRoomSize / 2), Math.round(maxRoomSize / 2)) * 2 + 2;
		room.height = Rng.randomInt(Math.round(minRoomSize / 2), Math.round(maxRoomSize / 2)) * 2 + 2;
		room.floorTiles = new Array(this.width * this.height);

		room.x = (Math.round(this.width / 2 - room.width / 2)) - 1;
		room.y = (Math.round(this.height / 2 - room.height / 2)) - 1;

		for (let x: number = room.x; x < room.x + room.width; ++x) {
			for (let y: number = room.y; y < room.y + room.height; ++y) {
				if (x == room.x || x == room.x + room.width - 1 || y == room.y || y == room.y + room.height - 1) {
					room.floorTiles[x + y * this.width] = 1; // 0 - floor, 1 - wall (used for non-rect rooms), 2 - door 
				} else {
					room.floorTiles[x + y * this.width] = 0; // 0 - floor, 1 - wall (used for non-rect rooms), 2- door 
				}
			}
		}

		room.exits.push(new Mark(Rng.randomInt(room.x + 3, room.x + room.width - 3), room.y, Direction.north, room.areaType));
		room.exits.push(new Mark(Rng.randomInt(room.x + 3, room.x + room.width - 3), room.y + room.height - 1, Direction.south, room.areaType));
		room.exits.push(new Mark(room.x, Rng.randomInt(room.y + 3, room.y + room.height - 3), Direction.west, room.areaType));
		room.exits.push(new Mark(room.x + room.width - 1, Rng.randomInt(room.y + 3, room.y + room.height - 3), Direction.east, room.areaType));

		// add foreced type before pushing to unusedExits
		this.addForcedType(room);

		room.exits.forEach((exit: Mark): void => {
			// local coordinates
			room.floorTiles[exit.x + exit.y * this.width] = 2;
			this.unusedExits.push(exit);
		});


		this.placeRoom(room, Tile.TEST_FLOOR);
	}

	private makeRectRoom(randomExit: Mark, firstRoom: boolean = false): boolean {
		const minRoomSize = 4;//6;
		const maxRoomSize = 14;//12;

		let room: Room = new Room();
		room.areaType = AreaType.room;

		room.width = Rng.randomInt(Math.round(minRoomSize / 2), Math.round(maxRoomSize / 2)) * 2 + 2;
		room.height = Rng.randomInt(Math.round(minRoomSize / 2), Math.round(maxRoomSize / 2)) * 2 + 2;
		room.floorTiles = new Array(this.width * this.height);

		// we add only 3 exits the source dir exits is random
		if (randomExit.dir == Direction.north) {
			room.x = Rng.randomInt(randomExit.x - Math.round(room.width / 2), randomExit.x - 3);
			room.y = randomExit.y - room.height + 1;// randomExit.y - room.height +1????
		}
		else if (randomExit.dir == Direction.south) {
			room.x = Rng.randomInt(randomExit.x - Math.round(room.width / 2), randomExit.x - 3);//+ Math.round(room.width / 2) - 2
			room.y = randomExit.y; //randomExit.y + 1
		}
		else if (randomExit.dir == Direction.west) {
			room.x = randomExit.x - room.width + 1; //randomExit.x - room.width
			room.y = Rng.randomInt(randomExit.y - Math.round(room.height / 2), randomExit.y - 3); // + Math.round(room.height / 2) - 2
		}
		else if (randomExit.dir == Direction.east) {
			room.x = randomExit.x; //randomExit.x + 1
			room.y = Rng.randomInt(randomExit.y - Math.round(room.height / 2), randomExit.y - 3);
		}

		for (let x: number = room.x; x < room.x + room.width; ++x) {
			for (let y: number = room.y; y < room.y + room.height; ++y) {
				if (x == room.x || x == room.x + room.width - 1 || y == room.y || y == room.y + room.height - 1) {
					room.floorTiles[x + y * this.width] = 1; // 0 - floor, 1 - wall (used for non-rect rooms), 2 - door 
				} else {
					room.floorTiles[x + y * this.width] = 0; // 0 - floor, 1 - wall (used for non-rect rooms), 2- door 
				}
			}
		}

		// add 4 exits if first room, 3 otherwise 
		if (randomExit.dir != Direction.south) // north side
			room.exits.push(new Mark(Rng.randomInt(room.x + 3, room.x + room.width - 3), room.y, Direction.north, room.areaType));
		if (randomExit.dir != Direction.north) // south side
			room.exits.push(new Mark(Rng.randomInt(room.x + 3, room.x + room.width - 3), room.y + room.height - 1, Direction.south, room.areaType));
		if (randomExit.dir != Direction.east) // west side
			room.exits.push(new Mark(room.x, Rng.randomInt(room.y + 3, room.y + room.height - 3), Direction.west, room.areaType));
		if (randomExit.dir != Direction.west) // east side
			room.exits.push(new Mark(room.x + room.width - 1, Rng.randomInt(room.y + 3, room.y + room.height - 3), Direction.east, room.areaType));

		// add foreced type before pushing to unusedExits
		this.addForcedType(room);

		if (this.canPlace(room)) {
			room.exits.forEach((exit: Mark): void => {
				room.floorTiles[exit.x + exit.y * this.width] = 2;

				this.unusedExits.push(exit);
			});

			this.placeRoom(room, Tile.TEST_FLOOR);

			return true;
		}

		return false;
	}

	private makeCorridor(randomExit: Mark): boolean {
		const minCorridorLength: number = 3;
		const maxCorridorLength: number = 12;

		let corridor: Room = new Room();
		corridor.areaType = AreaType.corridor;

		corridor.floorTiles = new Array(this.width * this.height);

		// we add only 3 exits the source dir exits is random
		if (randomExit.dir == Direction.north) {
			corridor.x = randomExit.x - 1;
			corridor.y = randomExit.y - corridor.height + 1;// randomExit.y - room.height +1????

			corridor.width = 3;
			corridor.height = Rng.randomInt(Math.round(minCorridorLength / 2), Math.round(maxCorridorLength / 2)) * 2 + 1;
		}
		else if (randomExit.dir == Direction.south) {
			corridor.x = randomExit.x - 1;
			corridor.y = randomExit.y; //randomExit.y + 1

			corridor.width = 3;
			corridor.height = Rng.randomInt(Math.round(minCorridorLength / 2), Math.round(maxCorridorLength / 2)) * 2 + 1;
		}
		else if (randomExit.dir == Direction.west) {
			corridor.x = randomExit.x - corridor.width + 1; //randomExit.x - room.width
			corridor.y = randomExit.y - 1;

			corridor.width = Rng.randomInt(Math.round(minCorridorLength / 2), Math.round(maxCorridorLength / 2)) * 2 + 1;
			corridor.height = 3;
		}
		else if (randomExit.dir == Direction.east) {
			corridor.x = randomExit.x; //randomExit.x + 1
			corridor.y = randomExit.y - 1;

			corridor.width = Rng.randomInt(Math.round(minCorridorLength / 2), Math.round(maxCorridorLength / 2)) * 2 + 1;
			corridor.height = 3;
		}

		for (let x: number = corridor.x; x < corridor.x + corridor.width; ++x) {
			for (let y: number = corridor.y; y < corridor.y + corridor.height; ++y) {
				if (x == corridor.x || x == corridor.x + corridor.width - 1 || y == corridor.y || y == corridor.y + corridor.height - 1) {
					corridor.floorTiles[x + y * this.width] = 1; // 0 - floor, 1 - wall (used for non-rect rooms), 2 - door 
				} else {
					corridor.floorTiles[x + y * this.width] = 0; // 0 - floor, 1 - wall (used for non-rect rooms), 2- door 
				}
			}
		}

		// add 4 exits if first room, 3 otherwise 
		if (randomExit.dir != Direction.south) {// north side
			if (randomExit.dir == Direction.north)
				corridor.exits.push(new Mark(corridor.x + 1, corridor.y, Direction.north, corridor.areaType));
			else
				corridor.exits.push(new Mark(Rng.randomInt(corridor.x + 2, corridor.x + corridor.width - 2), corridor.y, Direction.north, corridor.areaType));
		}
		if (randomExit.dir != Direction.north) {// south side
			if (randomExit.dir == Direction.south)
				corridor.exits.push(new Mark(corridor.x + 1, corridor.y + corridor.height - 1, Direction.north, corridor.areaType));
			else
				corridor.exits.push(new Mark(Rng.randomInt(corridor.x + 2, corridor.x + corridor.width - 2), corridor.y + corridor.height - 1, Direction.south, corridor.areaType));
		}
		if (randomExit.dir != Direction.east) { // west side
			if (randomExit.dir == Direction.west)
				corridor.exits.push(new Mark(corridor.x, corridor.y + 1, Direction.west, corridor.areaType));
			else
				corridor.exits.push(new Mark(corridor.x, Rng.randomInt(corridor.y + 2, corridor.y + corridor.height - 2), Direction.west, corridor.areaType));
		}
		if (randomExit.dir != Direction.west) { // east side
			if (randomExit.dir == Direction.east)
				corridor.exits.push(new Mark(corridor.x + corridor.width - 1, corridor.y + 1, Direction.east, corridor.areaType));
			else
				corridor.exits.push(new Mark(corridor.x + corridor.width - 1, Rng.randomInt(corridor.y + 2, corridor.y + corridor.height - 2), Direction.east, corridor.areaType));
		}

		// add foreced type before pushing to unusedExits
		this.addForcedType(corridor);

		if (this.canPlace(corridor)) {
			corridor.exits.forEach((exit: Mark): void => {
				corridor.floorTiles[exit.x + exit.y * this.width] = 2;

				this.unusedExits.push(exit);
			});

			this.placeRoom(corridor, Tile.TEST_FLOOR);

			return true;
		}

		return false;
	}

	// compare area types and return corresponding room shape 
	private createRoomByType(areaType: AreaType, exit: Mark): boolean {
		if (areaType == AreaType.room)
			return this.makeRectRoom(exit);
		else if (areaType == AreaType.corridor)
			return this.makeCorridor(exit);

		// could not make room
		return false;
	}

	private addForcedType(room: Room): void {
		let choice: number = Math.random();
		let sameTypeChance: number | undefined = this.settings.seq.get(room.areaType);

		// force same type only once per room 
		if (sameTypeChance && (choice <= sameTypeChance) && !room.sameTypeForced) {
			room.sameTypeForced = true;
			room.exits[Rng.randomInt(room.exits.length)].forcedNextAreaType = room.areaType;
		}
	}

	private canPlace(room: Room): boolean {
		// check if inside map 
		if (room.x <= 1 || room.y <= 1 || room.x + room.width > this.width - 1 || room.y + room.height > this.height - 1)
			return false;

		// check if overlaps other rooms (-1 and +1 for room borders)
		for (let x: number = room.x; x < room.x + room.width; ++x) {
			for (let y: number = room.y; y < room.y + room.height; ++y) {
				// if (this.tiles[x + y * this.width] != Tile.WALL
				// 	&& this.tiles[x + y * this.width] != Tile.TEST_WALL
				// 	&& room.floorTiles[x + y * room.width] != 1)
				// 	return false;
				if (this.tiles[x + y * this.width] == Tile.TEST_FLOOR
					&& room.floorTiles[x + y * this.width] == 0
					|| (this.tiles[x + y * this.width] == Tile.TEST_FLOOR && room.floorTiles[x + y * this.width] == 1))
					return false;
			}
		}

		return true;
	}

	// add room on the map 
	// private placeRoom(room: Room, tile: Tile): void {
	// 	for (let x: number = room.x; x < room.x + room.width; ++x) {
	// 		for (let y: number = room.y; y < room.y + room.height; ++y) {
	// 			if (room.floorTiles[(x - room.x) + (y - room.y) * room.width] == 0) {
	// 				this.tiles[x + y * this.width] = tile;
	// 			} else if (room.floorTiles[(x - room.x) + (y - room.y) * room.width] == 2) {
	// 				this.tiles[x + y * this.width] = Tile.TEST_DOOR;
	// 			} else if (room.floorTiles[(x - room.x) + (y - room.y) * room.width] == 1) {
	// 				this.tiles[x + y * this.width] = Tile.TEST_WALL;
	// 			}
	// 		}
	// 	}
	// 	this.unusedExits.forEach((exit) => {
	// 		this.tiles[exit.x + exit.y * this.width] = Tile.TEST_DOOR;
	// 	});

	// 	this.rooms.push(room);
	// }

	// add room on the map 
	private placeRoom(room: Room, tile: Tile): void {
		for (let x: number = room.x; x < room.x + room.width; ++x) {
			for (let y: number = room.y; y < room.y + room.height; ++y) {
				if (room.floorTiles[x + y * this.width] == 0) {
					this.tiles[x + y * this.width] = tile;
				} else if (room.floorTiles[x + y * this.width] == 2) {
					this.tiles[x + y * this.width] = Tile.TEST_DOOR;
				} else if (room.floorTiles[x + y * this.width] == 1) {
					this.tiles[x + y * this.width] = Tile.TEST_WALL;
				}
			}
		}
		this.rooms.push(room);
	}

	private initWithTiles(tile: Tile): void {
		for (let i: number = 0; i < this.width; i++)
			for (let j: number = 0; j < this.height; j++)
				this.tiles[i + j * this.width] = tile;
	}
}