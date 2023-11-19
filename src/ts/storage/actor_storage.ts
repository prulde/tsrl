import Actor from "../actor/actor";
import Breed from "../actor/breed";
import Color from "../render/color";
import Glyph from "../render/glyph";

type StorageType = {
	name: string,
	glyph: Glyph,
	maxHp: number,
	attack: number;
	defense: number;
	isPlayer: boolean;
};

enum ActorType {
	player = 0,
	dragon = 1,
}

class ActorStorage {
	private static definedTypes: StorageType[] = [
		{
			name: "you",
			glyph: new Glyph("@", Color.white, Color.black),
			maxHp: 30,
			attack: 10,
			defense: 5,
			isPlayer: true,
		},
		{
			name: "dragon",
			glyph: new Glyph("D", Color.yellow, Color.black),
			maxHp: 15,
			attack: 5,
			defense: 0,
			isPlayer: false,
		}];

	private static getBreed(type: ActorType): Breed | null {
		for (let i: number = 0; i < this.definedTypes.length; ++i) {
			if (i === type) {
				return new Breed(this.definedTypes[i]);
			}
		}
		return null;
	}

	// public static makeActor(x: number, y: number, type: ActorType): Actor {
	// 	const breed: Breed | null = this.getBreed(type);
	// 	if (!breed) {
	// 		throw new TypeError(`breed:${type} is not defined`);
	// 	}
	// 	return new Actor(x, y);
	// }
}

export { ActorStorage, ActorType, StorageType };