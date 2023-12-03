import { Game, Actor, GameScreen, Level, Glyph, Color, Fov, LevelBuilder, Action, ActionResult, Viewport } from "../engine/engine";
import { Hero } from "./hero/hero";
import { PlayScreen } from "./screen/play_screen";

class MyGame extends Game {
	public player: Actor;
	public currentScreen: GameScreen;
	public currentLevel: Level;

	constructor() {
		super();

		Viewport.makeTerminal(100, 100, "data/cp437_16x16_test.png", 16, 16);

		this.currentLevel = new LevelBuilder(100, 100, 1).makeMap();
		this.player = new Hero(25, 25, new Glyph("@", Color.white, Color.black));

		this.currentLevel.addActor(this.player);
		this.currentLevel.computeFov(this.player.position, 8, Fov.RecursiveShadowcasting);

		this.currentScreen = new PlayScreen(6, 6, 50, 50, this.currentLevel.width, this.currentLevel.height);
	}

	protected update(): void {
		let action: Action | null = this.currentScreen.getKeyAction(Game.inputKey);
		if (action) {
			let result: ActionResult = action.perform(this.player, this);
			while (result.altAction) {
				action = result.altAction;
				result = action.perform(this.player, this);
			}
			if (result.moved) {
				this.currentLevel.computeFov(this.player.position, 8, Fov.RecursiveShadowcasting);
				//this.currentScreen.moveCamera(this.player.x, this.player.y);
			}
			if (result.performed) {

			}
		}

		this.currentScreen.render(this, this.player.position);
	}
}

// entrypoint
let game: Game = new MyGame();