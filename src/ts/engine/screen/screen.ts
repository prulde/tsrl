import { Action } from "../action/action";

interface GameScreen {
	render(...opt: any): void;
	getKeyAction(inputKey: string): Action | null;
}

export { GameScreen };