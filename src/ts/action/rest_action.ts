import Actor from "../actor/actor";
import { Action, ActionResult } from "./action";

export default class RestAction extends Action {
	public override perform(owner: Actor): ActionResult {
		return new ActionResult(true, false, null, null);
	}
}