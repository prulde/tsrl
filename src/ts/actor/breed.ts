import Glyph from "../render/glyph";
import { StorageType } from "../storage/actor_storage";

export default class Breed {
	public name: string;
	public maxHp: number;
	public attack: number;
	public defense: number;

	//(name: string, maxHp: number, attack: number, defense: number)
	constructor(type: StorageType) {
		this.name = type.name;
		this.maxHp = type.maxHp;
		this.attack = type.attack;
		this.defense = type.defense;
	};
};