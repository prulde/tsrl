import { GameScreen, Camera, Position, Tile, Actor, Action, InputKey, Level } from "../../engine/engine";
import { RestAction } from "../action/rest_action";
import { WalkAction } from "../action/walk_action";
import { DebugSettings } from "../main";

class PlayScreen implements GameScreen {
	private _cameraViewport: Camera;

	constructor(x: number, y: number, width: number, height: number, boundWidth: number, boundHeigh: number) {
		this._cameraViewport = new Camera(x, y, width, height, boundWidth, boundHeigh);
	}

	public render(currentLevel: Level, position: Position): void {
		this._cameraViewport.moveCamera(position.x, position.y);

		this.drawMap(currentLevel);
		this.drawCorpses(currentLevel);
		this.drawActors(currentLevel);

		this._cameraViewport.render();
	}

	private drawMap(currentLevel: Level): void {
		for (let i: number = 0; i < this._cameraViewport.width; ++i) {
			for (let j: number = 0; j < this._cameraViewport.height; ++j) {
				let x: number = this._cameraViewport.camerax + i;
				let y: number = this._cameraViewport.cameray + j;
				let position = new Position(x, y);

				if (DebugSettings.noFov) {
					this._cameraViewport.putChar(currentLevel.getChar(position), i, j);
					continue;
				}

				if (currentLevel.isInFov(position)) {
					this._cameraViewport.putChar(currentLevel.getChar(position), i, j);
				}
				else if (currentLevel.isExplored(position)) {
					this._cameraViewport.putChar(Tile.FOG.glyph, i, j);
				}
				// because i dont use clear() for render
				else {
					this._cameraViewport.putChar(Tile.FOG.glyph, i, j);
				}
			}
		}
	}

	private drawCorpses(currentLevel: Level): void {

	}

	private drawActors(currentLevel: Level): void {
		const levelActors: Actor[] = currentLevel.actors;
		for (const actor of levelActors) {
			const point = this._cameraViewport.toCameraCoordinates(actor.position.x, actor.position.y);

			if (DebugSettings.noFov && point.inBounds) {
				this._cameraViewport.putChar(actor.glyph, point._x, point._y);
				continue;
			}

			if (currentLevel.isInFov(actor.position)) {

				if (point.inBounds) {
					this._cameraViewport.putChar(actor.glyph, point._x, point._y);
				} else {
					this._cameraViewport.putChar(Tile.FOG.glyph, point._x, point._y);
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

export { PlayScreen };