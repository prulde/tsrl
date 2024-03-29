import Glyph from "../../render/glyph";
import Actor from "../actor";

export default class Hero extends Actor {
	constructor(x: number, y: number, glyph: Glyph) {
		super(x, y, glyph);
		this.hp = 30;
	}

	public override isPlayer(): boolean {
		return true;
	}
}