export interface IDataInput {
	zero_energy: number;
	ticks: {
		distance: number[];
		label: string[];
	};
	distances: Array<number[]>;
	energy: Array<{
		"1": Array<number[]>;
		"-1": Array<number[]>;
	}>;
}

interface IBoundary {
	low: number;
	high: number;
}

interface IModel {
	legend: Record<string, number>;
	records: Record<string, number>[];
}

interface IModelOptions {
	boundary?: IBoundary;
}

export class ModelGenerator {
	public generateModel(dataInput: IDataInput, options?: IModelOptions): IModel {
		const records: Record<string, number>[] = [];
		const legend: Record<string, number> = {};

		const { distances, energy } = dataInput;
		const map: Record<string, Record<string, number>> = {};

		for (let distanceSetIndex = 0; distanceSetIndex < distances.length; distanceSetIndex++) {
			// debugger;
			const distanceSet = distances[distanceSetIndex];
			const { "1": spinUp2DSet, "-1": spinDown2DSet } = energy[distanceSetIndex];

			if (spinUp2DSet.length !== spinDown2DSet.length) {
				throw new Error("spin sets are of different length");
			}

			for (let xIndex = 0; xIndex < distanceSet.length; xIndex++) {
				const distanceValue = distanceSet[xIndex];
				for (let spinSetIndex = 0; spinSetIndex < spinUp2DSet.length; spinSetIndex++) {
					const spinUpSetValue = spinUp2DSet[spinSetIndex][xIndex];
					const spinDownSetValue = spinDown2DSet[spinSetIndex][xIndex];

					const spinUpsetKey = `spinUp-${spinSetIndex}-${distanceSetIndex}`;
					const spinDownKey = `spinDown-${spinSetIndex}-${distanceSetIndex}`;

					let entry = null;

					// TODO

					if (options?.boundary) {
						const { low, high } = options?.boundary;
						if (
							low <= spinUpSetValue &&
							spinUpSetValue <= high &&
							low <= spinDownSetValue &&
							spinDownSetValue <= high
						) {
							entry = {
								x: distanceValue,
								[spinUpsetKey]: spinUpSetValue,
								[spinDownKey]: spinDownSetValue,
							};
						} else if (
							(low <= spinUpSetValue && spinUpSetValue <= high) ||
							(low <= spinDownSetValue && spinDownSetValue <= high)
						) {
							if (low <= spinUpSetValue && spinUpSetValue <= high) {
								entry = {
									x: distanceValue,
									[spinUpsetKey]: spinUpSetValue,
								};
							} else {
								entry = {
									x: distanceValue,
									[spinDownKey]: spinDownSetValue,
								};
							}
						}
					}

					if (entry) {
						map[distanceValue] = map[distanceValue] ? { ...map[distanceValue], ...entry } : entry;
					} else {
						continue;
					}

					if (!legend[spinUpsetKey]) {
						legend[spinUpsetKey] = 1;
					}
					if (!legend[spinDownKey]) {
						legend[spinDownKey] = 1;
					}
				}
			}
		}

		Object.keys(map).forEach((key) => {
			const entry = {
				...map[key],
			};
			records.push(entry);
		});

		// debugger;
		return {
			legend,
			records,
		};
	}
}
