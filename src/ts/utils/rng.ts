export default class Rng {
	public static randomInt(max: number, min: number = 0): number {
		if (min == 0)
			return Math.round(Math.random() * (max - 1));
		else
			return Math.round(Math.random() * (max - min + 1) + min);
	}

	public static randomBoolean(probability: number = 0.5): boolean {
		return (Math.random() > probability);
	}
}