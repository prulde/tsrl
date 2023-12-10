import { Action, Position, Actor, ActionResult, Level } from "../../engine/engine";
import { DebugSettings } from "../main";

export class WalkAction extends Action {
	private position: Position;

	constructor(position: Position) {
		super();
		this.position = Position.from(position);
	}

	public override perform(owner: Actor, currentLevel: Level): ActionResult {

		let targetPosition: Position = Position.add(this.position, owner.position);

		if (DebugSettings.noCollision) {
			owner.position = Position.from(targetPosition);
			return new ActionResult(true, true, null, null);
		}

		if (currentLevel.blocks(targetPosition)) {
			return new ActionResult(false, true, null, null);
		}

		const levelActors: Actor[] = currentLevel.actors;
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