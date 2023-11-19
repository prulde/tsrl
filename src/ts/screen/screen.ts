import { Action } from "../action/action";

export default interface Screen {
	render(...opt: any): void;
	getKeyAction(inputKey: string): Action | null;
}