import { Actor } from "../actor/actor";
import { RoomsAndMazes } from "./generation/rooms_and_mazes";
import { RoomAddition } from "./generation/room_addition";
import { Level } from "./level";
import { Tile } from "./tile";
import { FeatureBuilder } from "./generation/features";

// use strategy?
class LevelBuilder {
	private width: number;
	private height: number;
	private depth: number;
	private tiles: Tile[] = [];
	private actors: Actor[] = [];

	constructor(width: number, height: number, depth: number) {
		this.width = width;
		this.height = height;
		this.tiles = new Array(width * height);
		this.depth = depth;
	}

	public makeLevel(): Level {
		//this.populate(0.05, Tile.WALL);
		//this.initWithTiles(Tile.WALL);
		//let catacombs: RoomAddition = new RoomAddition(this.width, this.height, this.tiles, this.depth);
		//catacombs.generate();
		//let crypt: RoomsAndMazes = new RoomsAndMazes(this.width, this.height, this.tiles, this.depth);
		//crypt.generate();//makeCrypt(10);

		//	this.addActors(25);
		//this.addBoundaries();
		let tileMap: FeatureBuilder = new FeatureBuilder(this.width, this.height, this.tiles, this.depth);
		tileMap.generate();
		return new Level(this.width, this.height, this.tiles, this.actors);
	}

	private addActors(amount: number): void {
		for (let i: number = 0; i < amount; ++i) {
			let x: number;
			let y: number;

			do {
				x = Math.floor(Math.random() * this.width);
				y = Math.floor(Math.random() * this.height);
			} while (this.tiles[x + y * this.width].blocks);
			//this.actors.push(ActorStorage.makeActor(x, y, ActorType.dragon));
		}
	}

	private initWithTiles(tile: Tile): void {
		for (let i: number = 0; i < this.width; i++) {
			for (let j: number = 0; j < this.height; j++) {
				this.tiles[i + j * this.width] = tile;
			}
		}
	}

	private populate(precision: number, populateWith: Tile): void {
		for (let i: number = 0; i < this.width; i++) {
			for (let j: number = 0; j < this.height; j++) {
				this.tiles[i + j * this.width] = Math.random() < precision ? populateWith : Tile.GRASS;
			}
		}
	};

	private addBoundaries(): void {
		for (let i: number = 0; i < this.width; i++) {
			for (let j: number = 0; j < this.height; j++) {
				if (i == 0 || i == this.width - 1 || j == 0 || j == this.height - 1) {
					this.tiles[i + j * this.width] = Tile.BOUND;
				}
			}
		}
	}
}

export { LevelBuilder };