import Actor from "../actor/actor";
import { game } from "../main";
import Position from "../util/position";
import { Action, ActionResult } from "./action";

export default class WalkAction extends Action {
	private position: Position;

	constructor(position: Position) {
		super();
		this.position = Position.from(position);
	}

	public override perform(owner: Actor): ActionResult {

		let targetPosition: Position = Position.add(this.position, owner.position);

		/* debug */
		if (game.config.noCollision) {
			owner.position = Position.from(targetPosition);
			return new ActionResult(true, true, null, null);
		}

		if (game.currentLevel.blocksLOS(targetPosition)) {
			return new ActionResult(false, true, null, null);
		}

		const levelActors: Actor[] = game.currentLevel.actors;
		for (const actor of levelActors) {
			if (actor.blocks && owner.position.equals(targetPosition)) {
				if (!owner.isPlayer && !actor.isPlayer) {
					break;
				}
				return new ActionResult(true, true, null, null);
			}
		}

		owner.position = Position.from(targetPosition);
		return new ActionResult(true, true, null, null);
	}
}