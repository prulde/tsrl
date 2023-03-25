import Glyph from "../termial/glyph";
import { StorageType } from "../storage/actor_storage";

export default class Breed {
	public name: string;
	public glyph: Glyph;
	public maxHp: number;
	public attack: number;
	public defense: number;
	public isPlayer: boolean;

	//(name: string, glyph: Glyph, maxHp: number, attack: number, defense: number, isPlayer: boolean)
	constructor(type: StorageType) {
		this.name = type.name;
		this.glyph = type.glyph;
		this.maxHp = type.maxHp;
		this.attack = type.attack;
		this.defense = type.defense;
		this.isPlayer = type.isPlayer;
	};
};