import { Action, ActionResult, Actor, Game } from "../../engine/engine";

export default class RestAction extends Action {
	public override perform(owner: Actor, game: Game): ActionResult {
		return new ActionResult(true, false, null, null);
	}
}