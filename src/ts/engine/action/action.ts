import { Actor } from "../actor/actor";
import { Game } from "../core/game";
import { GameScreen } from "../screen/screen";

class ActionResult {
	private _performed: boolean;
	private _moved: boolean;
	private _altAction: Action | null;
	private _altScreen: GameScreen | null;

	constructor(performed: boolean, moved: boolean, altAction: Action | null, altScreen: GameScreen | null) {
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

	get altScreen(): GameScreen | null {
		return this._altScreen;
	}
}

abstract class Action {
	public abstract perform(actor: Actor, ...opt: any): ActionResult;
}

export { Action, ActionResult };