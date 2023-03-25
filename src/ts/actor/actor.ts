import Glyph from "../termial/glyph";
import Breed from "./breed";

export default class Actor {
	private breed: Breed;
	private behavior: any;
	public x: number;
	public y: number;
	public hp: number;
	public blocks: boolean;

	constructor(x: number, y: number, breed: Breed, behavior: any) {
		this.x = x;
		this.y = y;
		this.blocks = true;
		this.breed = breed;
		this.behavior = behavior;

		this.hp = this.breed.maxHp;
	};

	get maxHp(): number {
		return this.breed.maxHp;
	};

	get glyph(): any {
		return this.breed.glyph;
	};

	get attack(): number {
		return this.breed.attack;
	};

	get defense(): number {
		return this.breed.defense;
	};

	get isPlayer(): boolean {
		return this.breed.isPlayer;
	};

};