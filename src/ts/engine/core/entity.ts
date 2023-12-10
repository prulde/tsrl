abstract class Entity {
	protected _name: string;
	protected _stats: Map<string, number>;

	constructor(name: string, stats?: Map<string, number>) {
		this._name = name;
		this._stats = stats !== undefined ? stats : new Map<string, number>();
	}

	public getStat(name: string): number {
		return this.validateStat(name);
	}

	public setStat(name: string, value: number): void {
		this._stats.set(name, value);
	}

	public setStats(stats: Map<string, number>): void {
		this._stats = stats;
	}

	get name(): string {
		return this._name;
	}

	set name(name: string) {
		this._name = name;
	}

	protected validateStat(name: string): number {
		try {
			let stat: number | undefined = this._stats.get(name);
			if (stat !== undefined)
				return stat;
			throw new Error(`stat with "${name}" label does not exists`);
		} catch (error) {
			throw error;
		}
	}
}

export { Entity };