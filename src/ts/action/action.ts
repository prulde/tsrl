import Actor from "../actor/actor";
import { game } from "../main";
import GameScreen from "../screen/screen";

class ActionResult {
	public performed: boolean;
	public moved: boolean;
	public altAction: Action | null;
	public altScreen: GameScreen | null;

	constructor(performed: boolean, moved: boolean, altAction: Action | null, altScreen: GameScreen | null) {
		this.performed = performed;
		this.moved = moved;
		this.altAction = altAction;
		this.altScreen = altScreen;
	}
}

abstract class Action {
	abstract perform(actor: Actor): ActionResult;
}

class WalkAction extends Action {
	private x: number;
	private y: number;

	constructor(x: number, y: number) {
		super();
		this.x = x;
		this.y = y;
	}

	perform(owner: Actor): ActionResult {

		/* debug */
		if (game.noCollision) {
			owner.x += this.x;
			owner.y += this.y;
			return new ActionResult(true, true, null, null);
		}

		let targetx: number = this.x + owner.x;
		let targety: number = this.y + owner.y;

		if (game.currentLevel.blocks(targetx, targety)) {
			return new ActionResult(false, true, null, null);
		}

		const mapActors: Actor[] = game.currentLevel.actors;
		for (const actor of mapActors) {
			if (actor.blocks && actor.x === targetx && actor.y === targety) {
				if (!owner.isPlayer && !actor.isPlayer) {
					break;
				}
				return new ActionResult(true, true, null, null);
			}
		}

		owner.x += this.x;
		owner.y += this.y;
		return new ActionResult(true, true, null, null);
	}
}

class RestAction {
	perform(owner: Actor): ActionResult {
		return new ActionResult(true, false, null, null);
	}
}

export { Action, ActionResult, WalkAction, RestAction };