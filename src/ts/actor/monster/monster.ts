import Glyph from "../../render/glyph";
import Actor from "../actor";
import Breed from "../breed";

export default class Monster extends Actor {
	private breed: Breed;
	constructor(x: number, y: number, glyph: Glyph, breed: Breed) {
		super(x, y, glyph);
		this.breed = breed;

		this.hp = this.breed.maxHp;
	};

	get maxHp(): number {
		return this.breed.maxHp;
	};

	get attack(): number {
		return this.breed.attack;
	};

	get defense(): number {
		return this.breed.defense;
	};

	public isPlayer(): boolean {
		return false;
	};
}