import Actor from "../actor/actor";
import Screen from "../screen/screen";

class ActionResult {
	private _performed: boolean;
	private _moved: boolean;
	private _altAction: Action | null;
	private _altScreen: Screen | null;

	constructor(performed: boolean, moved: boolean, altAction: Action | null, altScreen: Screen | null) {
		this._performed = performed;
		this._moved = moved;
		this._altAction = altAction;
		this._altScreen = altScreen;
	}

	get performed(): boolean {
		return this._performed;
	}

	get moved(): boolean {
		return this._moved;
	}

	get altAction(): Action | null {
		return this._altAction;
	}

	get altScreen(): Screen | null {
		return this._altScreen;
	}
}

abstract class Action {
	public abstract perform(actor: Actor): ActionResult;
}

export { Action, ActionResult };