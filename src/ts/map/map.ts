import Actor from "../actor/actor";
import Color from "../termial/color";
import Glyph from "../termial/glyph";
import Tile from "./tile";

export default class GameMap {
	private _width: number;
	private _height: number;
	private _tiles: Tile[] = [];
	private _actors: Actor[] = [];
	private _corpses: Actor[] = [];

	constructor(width: number, height: number, tiles: Tile[], actors: Actor[]) {
		this._width = width;
		this._height = height;
		this._tiles = tiles;
		this._actors = actors;
	}

	public isInsideMap(x: number, y: number): boolean {
		if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
			return false;
		}
		return true;
	}

	public addActor(actor: Actor): void {
		this._actors.push(actor);
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

	public isWall(x: number, y: number): boolean {
		if (this.isInsideMap(x, y) && this._tiles[x + y * this._width].blocks) {
			return true;
		}
		return false;
	}

	public getChar(x: number, y: number): Glyph {
		if (this.isInsideMap(x, y)) {
			return this._tiles[x + y * this._width].glyph;

		}
		return Tile.BOUND.glyph;
	}

	public getColor(x: number, y: number): Color {
		if (this.isInsideMap(x, y)) {
			return this._tiles[x + y * this._width].glyph.fcol;

		}
		return Color.red;
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