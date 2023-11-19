import { Action } from "../action/action";
import Actor from "../actor/actor";
import { InputKey, game } from "../main";
import Tile from "../level/tile";
import Camera from "./camera";
import Screen from "./screen";
import Level from "../level/level";
import WalkAction from "../action/walk_action";
import RestAction from "../action/rest_action";
import Position from "../util/position";

export default class PlayScreen implements Screen {
	private camera: Camera;

	constructor(width: number, height: number) {
		this.camera = new Camera(width, height);
	}

	public render(position: Position): void {
		this.camera.moveCamera(position.x, position.y);

		this.drawMap();
		this.drawCorpses();
		this.drawActors();

		game.terminal.render();
	}

	private drawMap(): void {
		for (let i: number = 0; i < this.camera.width; ++i) {
			for (let j: number = 0; j < this.camera.height; ++j) {
				let x: number = this.camera.camerax + i;
				let y: number = this.camera.cameray + j;
				let position = new Position(x, y);

				if (game.config.noFov) {
					game.terminal.putChar(game.currentLevel.getChar(position), i, j);
					continue;
				}

				if (game.currentLevel.isInFov(position)) {
					game.terminal.putChar(game.currentLevel.getChar(position), i, j);
				}
				else if (game.currentLevel.isExplored(position)) {
					game.terminal.putChar(Tile.FOG.glyph, i, j);
				}
				// because i dont use clear() for render
				else {
					game.terminal.putChar(Tile.FOG.glyph, i, j);
				}
			}
		}
	}

	private drawCorpses(): void {

	}

	private drawActors(): void {
		const levelActors: Actor[] = game.currentLevel.actors;
		for (const actor of levelActors) {
			const point = this.camera.toCameraCoordinates(actor.position.x, actor.position.y);

			if (game.config.noFov && point.inBounds) {
				game.terminal.putChar(actor.glyph, point._x, point._y);
				continue;
			}


			if (game.currentLevel.isInFov(actor.position)) {


				if (point.inBounds) {
					game.terminal.putChar(actor.glyph, point._x, point._y);
				} else {
					game.terminal.putChar(Tile.FOG.glyph, point._x, point._y);
				}
			}

		}
	}

	public getKeyAction(inputKey: string): Action | null {
		if (inputKey === InputKey.NO_INPUT) {
			return null;
		}
		if (inputKey === InputKey.MN) {
			return new WalkAction(new Position(0, -1));
		}
		if (inputKey === InputKey.MS) {
			return new WalkAction(new Position(0, 1));
		}
		if (inputKey === InputKey.MW) {
			return new WalkAction(new Position(-1, 0));
		}
		if (inputKey === InputKey.ME) {
			return new WalkAction(new Position(1, 0));
		}
		if (inputKey === InputKey.MNE) {
			return new WalkAction(new Position(1, -1));
		}
		if (inputKey === InputKey.MNW) {
			return new WalkAction(new Position(-1, -1));
		}
		if (inputKey === InputKey.MSE) {
			return new WalkAction(new Position(1, 1));
		}
		if (inputKey === InputKey.MSW) {
			return new WalkAction(new Position(-1, 1));
		}
		if (inputKey === InputKey.SKIP) {
			return new RestAction();
		}
		return null;
	}
}