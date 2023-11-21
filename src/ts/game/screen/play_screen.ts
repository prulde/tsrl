import { GameScreen, Camera, Game, Position, Tile, Actor, Action, InputKey, config } from "../../engine/engine";
import { RestAction } from "../action/rest_action";
import { WalkAction } from "../action/walk_action";

export class PlayScreen implements GameScreen {
	private camera: Camera;

	constructor() {
		this.camera = new Camera();
	}

	public render(game: Game, position: Position): void {
		this.camera.moveCamera(position.x, position.y, game);

		this.drawMap(game);
		this.drawCorpses(game);
		this.drawActors(game);

		game.terminal.render();
	}

	private drawMap(game: Game): void {
		for (let i: number = 0; i < this.camera.width; ++i) {
			for (let j: number = 0; j < this.camera.height; ++j) {
				let x: number = this.camera.camerax + i;
				let y: number = this.camera.cameray + j;
				let position = new Position(x, y);

				if (config.noFov) {
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

	private drawCorpses(game: Game): void {

	}

	private drawActors(game: Game): void {
		const levelActors: Actor[] = game.currentLevel.actors;
		for (const actor of levelActors) {
			const point = this.camera.toCameraCoordinates(actor.position.x, actor.position.y);

			if (config.noFov && point.inBounds) {
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
		switch (inputKey) {
			case InputKey.W:
			case InputKey.ARROW_UP:
				return new WalkAction(new Position(0, -1));
			case InputKey.S:
			case InputKey.ARROW_DOWN:
				return new WalkAction(new Position(0, 1));
			case InputKey.A:
			case InputKey.ARROW_LEFT:
				return new WalkAction(new Position(-1, 0));
			case InputKey.D:
			case InputKey.ARROW_RIGHT:
				return new WalkAction(new Position(1, 0));
			case InputKey.E:
			case InputKey.PAGE_UP:
				return new WalkAction(new Position(1, -1));
			case InputKey.Q:
			case InputKey.HOME:
				return new WalkAction(new Position(-1, -1));
			case InputKey.C:
			case InputKey.PAGE_DOWN:
				return new WalkAction(new Position(1, 1));
			case InputKey.Z:
			case InputKey.END:
				return new WalkAction(new Position(-1, 1));
			case InputKey.SPACE:
				return new RestAction();
			case InputKey.NO_INPUT:
				return null;
			default:
				return null;
		}
	}
}