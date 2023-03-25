import { Action } from "../action/action";

export default interface GameScreen {
	render(...opt: any): void;
	getKeyAction(inputKey: string): Action | null;
}