export default class Color {
	/** 
	 * @param color - initial color
	 * @param factor - float number
	 * @returns a new Color that is darker than the initial color
	 */
	public static makeDarker(color: Color, factor: number): Color {
		return new Color(Math.max(Math.floor(color.r * factor), 0),
			Math.max(Math.floor(color.g * factor), 0),
			Math.max(Math.floor(color.b * factor), 0));
	}
	/**
	 * list of all colors, including user-defined
	 */
	public static colors: Color[] = [];

	public static readonly black: Color = new Color(0, 0, 0);
	//public static readonly gray = new Color(0, 0, 0);
	public static readonly darkestGrey: Color = new Color(31, 31, 31);
	public static readonly darkerGrey: Color = new Color(63, 63, 63);
	public static readonly darkGrey: Color = new Color(95, 95, 95);
	public static readonly grey: Color = new Color(127, 127, 127);
	public static readonly lightGrey: Color = new Color(159, 159, 159);
	public static readonly lighterGre: Color = new Color(191, 191, 191);
	public static readonly lightestGr: Color = new Color(223, 223, 223);
	public static readonly white: Color = new Color(255, 255, 255);

	public static readonly red: Color = new Color(255, 0, 0);
	public static readonly flame: Color = new Color(255, 63, 0);
	public static readonly orange: Color = new Color(255, 127, 0);
	public static readonly amber: Color = new Color(255, 191, 0);
	public static readonly yellow: Color = new Color(255, 255, 0);
	public static readonly lime: Color = new Color(191, 255, 0);
	public static readonly chartreuse: Color = new Color(127, 255, 0);
	public static readonly green: Color = new Color(0, 255, 0);
	public static readonly sea: Color = new Color(0, 255, 127);
	public static readonly turquoise: Color = new Color(0, 255, 191);
	public static readonly cyan: Color = new Color(0, 255, 255);
	public static readonly sky: Color = new Color(0, 191, 255);
	public static readonly azure: Color = new Color(0, 127, 255);
	public static readonly blue: Color = new Color(0, 0, 255);
	public static readonly han: Color = new Color(63, 0, 255);
	public static readonly violet: Color = new Color(127, 0, 255);
	public static readonly purple: Color = new Color(191, 0, 255);
	public static readonly fuchsia: Color = new Color(255, 0, 255);
	public static readonly magenta: Color = new Color(255, 0, 191);
	public static readonly pink: Color = new Color(255, 0, 127);
	public static readonly crimson: Color = new Color(255, 0, 63);

	readonly r: number;
	readonly g: number;
	readonly b: number;

	private constructor(r: number, g: number, b: number) {
		this.r = r;
		this.g = g;
		this.b = b;
		Color.colors.push(this);
	}

}