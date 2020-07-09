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
	referenceLines: Record<string, number>;
	fermiLine: number;
	conductionLowestEP: IPoint;
	valenceHighestEP: IPoint;
}

interface IPoint {
	x: number;
	y: number;
}

interface IModelOptions {
	boundary?: IBoundary;
}

export class ModelGenerator {
	public generateModel(dataInput: IDataInput, options?: IModelOptions): IModel {
		const records: Record<string, number>[] = [];
		const legend: Record<string, number> = {};

		const {
			distances,
			energy,
			ticks: { distance, label },
		} = dataInput;
		const map: Record<string, Record<string, number>> = {};

		const conductionLowestEP: IPoint = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
		const valenceHighestEP: IPoint = { x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER };

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

						if (entry[spinUpsetKey] < conductionLowestEP.y && entry[spinUpsetKey] > 0) {
							conductionLowestEP.y = entry[spinUpsetKey];
							conductionLowestEP.x = entry.x;
						}
						if (entry[spinUpsetKey] > valenceHighestEP.y && entry[spinUpsetKey] < 0) {
							valenceHighestEP.y = entry[spinUpsetKey];
							valenceHighestEP.x = entry.x;
						}
						if (!legend[spinUpsetKey]) {
							legend[spinUpsetKey] = 1;
						}
						if (!legend[spinDownKey]) {
							legend[spinDownKey] = 1;
						}
					} else {
						continue;
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

		const referenceLines = label.reduce((acc, el, index) => {
			acc[el] = distance[index];
			return acc;
		}, {} as Record<string, number>);

		// debugger;
		return {
			legend,
			records,
			referenceLines,
			fermiLine: dataInput.zero_energy,
			conductionLowestEP,
			valenceHighestEP,
		};
	}
}
