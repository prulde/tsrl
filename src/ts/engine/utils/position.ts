class Position {
	private readonly _x: number;
	private readonly _y: number;

	constructor(x: number, y: number) {
		this._x = x;
		this._y = y;
	}

	public static add(a: Position, b: Position): Position {
		return new Position(a.x + b.x, a.y + b.y);
	}

	public static mul(a: Position, b: Position): Position {
		return new Position(a.x * b.x, a.y * b.y);
	}

	public static from(position: Position): Position {
		return new Position(position.x, position.y);
	}

	public equals(position: Position): boolean {
		if (this._x === position.x && this._y === position.y)
			return true;
		return false;
	}

	get x(): number {
		return this._x;
	}
	get y(): number {
		return this._y;
	}
}

export { Position };