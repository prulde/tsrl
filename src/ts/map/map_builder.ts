import Actor from "../actor/actor";
import { game } from "../main";
import { ActorType, ActorStorage } from "../storage/actor_storage";
import GameMap from "./map";
import Tile from "./tile";

export default class MapBuilder {
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

	private addActors(amount: number): void {
		for (let i: number = 0; i < amount; ++i) {
			let x: number;
			let y: number;

			do {
				x = Math.floor(Math.random() * this.width);
				y = Math.floor(Math.random() * this.height);
			} while (this.tiles[x + y * this.width].blocks);
			this.actors.push(ActorStorage.makeActor(x, y, ActorType.dragon, null));
		}
	}

	private populate(precision: number, populateWith: Tile): void {
		for (let i: number = 0; i < this.width; i++) {
			for (let j: number = 0; j < this.height; j++) {
				this.tiles[i + j * this.width] = Math.random() < precision ? populateWith : Tile.GRASS;
			}
		}
		console.log("map populated");
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

	public makeMap(): GameMap {
		this.populate(0.05, Tile.WALL);
		this.addActors(25);
		this.addBoundaries();
		return new GameMap(this.width, this.height, this.tiles, this.actors);
	}
}