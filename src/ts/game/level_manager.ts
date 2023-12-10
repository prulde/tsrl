import { Level } from "../engine/level/level";
import { LevelBuilder } from "../engine/level/level_builder";

class LevelManager {
	private _levels: Map<string, Level>;
	private _activeLevel: Level;

	constructor() {
		this._levels = new Map();
	}

	public makeLevel(label: string, width: number, height: number, depth: number): Level {
		let level: Level = new LevelBuilder(width, height, depth).makeLevel();
		this._levels.set(label, level);
		return level;
	}

	public makeActive(label: string): Level {
		this._activeLevel = this.validateLevel(label);
		return this._activeLevel;
	}

	public getActiveLevel(): Level {
		return this._activeLevel;
	}

	private validateLevel(label: string): Level {
		try {
			let level: Level | undefined = this._levels.get(label);
			if (level !== undefined)
				return level;
			throw new Error(`level with "${label}" label does not exists`);
		} catch (error) {
			throw error;
		}
	}

}

export { LevelManager };