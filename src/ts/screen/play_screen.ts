import { Action, WalkAction, RestAction } from "../action/action";
import Actor from "../actor/actor";
import { InputKey, game, terminal } from "../main";
import Camera from "./camera";
import GameScreen from "./screen";

export default class PlayScreen implements GameScreen {
	private camera: Camera;

	constructor(width: number, height: number) {
		this.camera = new Camera(width, height);
	}

	public render(x: number, y: number): void {
		this.camera.moveCamera(x, y);

		this.drawMap();
		this.drawCorpses();
		this.drawActors();

		terminal.render();
	}

	private drawMap(): void {
		for (let i: number = 0; i < this.camera.getWidth(); ++i) {
			for (let j: number = 0; j < this.camera.getHeight(); ++j) {
				let x: number = this.camera.getCamerax() + i;
				let y: number = this.camera.getCameray() + j;

				terminal.putChar(game.currentMap.getChar(x, y), i, j);
			}
		}
	}

	private drawCorpses(): void {

	}

	private drawActors(): void {
		const mapActors: Actor[] = game.currentMap.actors;
		for (const actor of mapActors) {
			const point = this.camera.toCameraCoordinates(actor.x, actor.y);
			if (point.inBounds) {

				terminal.putChar(actor.glyph, point._x, point._y,);
			}
		}
	}

	public getKeyAction(inputKey: string): Action | null {
		if (inputKey === InputKey.NO_INPUT) {
			return null;
		}
		if (inputKey === InputKey.MN) {
			return new WalkAction(0, -1);
		}
		if (inputKey === InputKey.MS) {
			return new WalkAction(0, 1);
		}
		if (inputKey === InputKey.MW) {
			return new WalkAction(-1, 0);
		}
		if (inputKey === InputKey.ME) {
			return new WalkAction(1, 0);
		}
		if (inputKey === InputKey.MNE) {
			return new WalkAction(1, -1);
		}
		if (inputKey === InputKey.MNW) {
			return new WalkAction(-1, -1);
		}
		if (inputKey === InputKey.MSE) {
			return new WalkAction(1, 1);
		}
		if (inputKey === InputKey.MSW) {
			return new WalkAction(-1, 1);
		}
		if (inputKey === InputKey.SKIP) {
			return new RestAction();
		}
		return null;
	}
}