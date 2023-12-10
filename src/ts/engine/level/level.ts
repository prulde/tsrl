import { Actor } from "../actor/actor";
import { Color } from "../render/color";
import { Glyph } from "../render/glyph";
import { Position } from "../utils/position";
import { Fov, FovLevel, computeFov } from "./fov";
import { Tile } from "./tile";

class Level implements FovLevel {
	private _width: number;
	private _height: number;
	private _tiles: Tile[] = [];
	private _inFov: Position[] = [];
	private _actors: Actor[] = [];
	private _corpses: Actor[] = [];

	constructor(width: number, height: number, tiles: Tile[], actors: Actor[]) {
		this._width = width;
		this._height = height;
		this._tiles = tiles;
		this._actors = actors;
	}

	public isInsideMap(position: Position): boolean {
		if (position.x < 0 || position.x >= this._width || position.y < 0 || position.y >= this._height) {
			return false;
		}
		return true;
	}

	public isExplored(position: Position): boolean {
		if (!this.isInsideMap(position)) {
			return false;
		}
		return this._tiles[position.x + position.y * this.width].explored;
	}

	public computeFov(position: Position, sightRadius: number, fov: Fov): void {
		this._inFov = [];
		computeFov(this, position, sightRadius + 1, fov);
	}

	// fov map
	public blocks(position: Position): boolean {
		if (this.isInsideMap(position) && this._tiles[position.x + position.y * this._width].blocks) { // Tile.BOUNDS
			return true;
		}
		return false;
	}

	public reveal(position: Position): boolean {
		if (!this.isInsideMap(position)) {
			return false;
		}
		this._tiles[position.x + position.y * this.width].explored = true;
		this._inFov.push(position);
		return true;
	}


	public isInFov(position: Position): boolean {
		if (!this.isInsideMap(position)) {
			return false;
		}
		let value: boolean = false;
		this._inFov.forEach((p: Position): void => {
			if (p.x == position.x && p.y == position.y) {
				value = true;
				return;
			}
		});
		return value;
	}

	public addActor(actor: Actor): void {
		this._actors.push(actor);
	}



	// public containsActor(x: number, y: number): Actor | null {
	// 	for (const actor of this._actors) {
	// 		if (actor.blocks && actor.x === x && actor.y === y) {
	// 			return actor;
	// 		}
	// 	}
	// 	return null;
	// }

	public getChar(pos: Position): Glyph {
		if (this.isInsideMap(pos)) {
			return this._tiles[pos.x + pos.y * this._width].glyph;
		}
		return Tile.BOUND.glyph;
	}

	public getColor(pos: Position): Color {
		if (this.isInsideMap(pos)) {
			return this._tiles[pos.x + pos.y * this._width].glyph.fcol;
		}
		return Color.red;
	}

	public actorDied(actor: Actor): void {
		for (let i: number = 0, len: number = this._actors.length; i < len; ++i) {
			if (this._actors[i] === actor) {
				this._corpses.push(actor);
				this._actors.splice(i, 1);
				return;
			}
		}
	}

	get width(): number {
		return this._width;
	}

	get height(): number {
		return this._height;
	}

	get actors(): Actor[] {
		return this._actors;
	}

	get corpses(): Actor[] {
		return this._corpses;
	}
}

export { Level };