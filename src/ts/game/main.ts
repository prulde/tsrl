import { Game, Config, Terminal, Actor, GameScreen, Level, Glyph, Color, Fov, LevelBuilder, Action, ActionResult, ConfigBuilder } from "../engine/engine";
import Hero from "./hero/hero";
import PlayScreen from "./screen/play_screen";

class MyGame extends Game {
	public config: Config;
	public terminal: Terminal;
	public player: Actor;
	public currentScreen: GameScreen;
	public currentLevel: Level;

	constructor() {
		super();

		this.config = new ConfigBuilder()
			.noFov(true)
			.build();

		this.currentLevel = new LevelBuilder(100, 100, 1).makeMap();
		this.player = new Hero(25, 25, new Glyph("@", Color.white, Color.black));

		this.currentLevel.addActor(this.player);
		this.currentLevel.computeFov(this.player.position, this.config.sightRadius, Fov.RecursiveShadowcasting);

		// camera and terminal sizes must be equal
		this.currentScreen = new PlayScreen(this.config.screenWidth, this.config.screenHeight);
		this.terminal = new Terminal(this.config.screenWidth, this.config.screenHeight, "data/cp437_16x16_test.png", 16, 16);
	}

	protected update(): void {
		let action: Action | null = this.currentScreen.getKeyAction(Game.inputKey);
		if (action) {
			let result: ActionResult = action.perform(this.player, this);
			while (result.altAction) {
				action = result.altAction;
				result = action.perform(this.player, this);
			}
			if (result.altAction) {

			}
			if (result.moved) {
				this.currentLevel.computeFov(this.player.position, this.config.sightRadius, Fov.RecursiveShadowcasting);
				//this.currentScreen.moveCamera(this.player.x, this.player.y);
			}
			if (result.performed) {

			}
		}

		this.currentScreen.render(this, this.player.position);
	}
}

let game: Game = new MyGame();

export { game };