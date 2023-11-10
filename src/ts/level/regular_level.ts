import Actor from "../actor/actor";
import Fov from "./fov";
import Level from "./level";
import Tile from "./tile";

export default class RegularLevel extends Level {
	constructor(width: number, height: number, tiles: Tile[], actors: Actor[]) {
		super(width, height, tiles, actors);
	}
}