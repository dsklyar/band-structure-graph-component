import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./index.css";
import {
	LineChart,
	XAxis,
	YAxis,
	Line,
	RechartsFunction,
	ResponsiveContainer,
	ReferenceLine,
	ReferenceDot,
} from "recharts";
import { ModelGenerator, IDataInput } from "../../utils/model.util";

const useStyles = createUseStyles(styles);

interface RechartsFuncEvent {
	activeLabel: number;
}

interface IProps {
	data: IDataInput;
}

interface IMarkState {
	markedX: number | null;
	chartMarked: boolean;
}

export const LineChartComponent: React.FC<IProps> = ({ data }: IProps) => {
	//#region Hooks
	const classes = useStyles();
	const [{ markedX, chartMarked }, setMarkedState] = React.useState<IMarkState>({
		markedX: null,
		chartMarked: false,
	});
	//#endregion

	const modelGen = new ModelGenerator();
	const {
		legend,
		records,
		referenceLines,
		fermiLine,
		conductionLowestEP,
		valenceHighestEP,
	} = React.useMemo(
		() =>
			modelGen.generateModel(data, {
				boundary: { low: -2, high: 2 },
			}),
		[data],
	);

	//#region Handlers
	const onChartClick: RechartsFunction = (e: RechartsFuncEvent) => {
		setMarkedState({
			chartMarked: !chartMarked,
			markedX: !chartMarked ? e.activeLabel : null,
		});
	};
	//#endregion

	//#region JSX Function
	const memoLines = React.useMemo(
		() =>
			Object.keys(legend).map((key) => (
				<Line
					key={key}
					type="monotone"
					dataKey={key}
					dot={false}
					stroke={key.includes("Down") ? "#BB86FC" : "#03DAC5"}
					strokeWidth={2}
					isAnimationActive={false}
				/>
			)),
		[legend],
	);

	const memoReferenceLines = React.useMemo(
		() =>
			Object.keys(referenceLines).map((key, index) => (
				<ReferenceLine
					key={`refLine-${index}`}
					x={referenceLines[key]}
					stroke={"#FFF"}
					label={
						{
							position: "bottom",
							value: key,
							fontSize: 13,
							fontFamily: "monospace",
							fill: "#CBCBCB",
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
						} as any
					}
				/>
			)),
		[referenceLines],
	);

	const markedLine = chartMarked && markedX && (
		<ReferenceLine x={markedX} stroke={"lightgreen"} strokeWidth={3} />
	);

	//#endregion

	return (
		<ResponsiveContainer>
			<LineChart data={records} margin={{ left: -40, right: 10 }} onClick={onChartClick}>
				<ReferenceLine y={fermiLine} stroke={"lightblue"} strokeWidth={3} strokeDasharray="3 3" />
				<ReferenceDot y={conductionLowestEP.y} x={conductionLowestEP.x} r={5} fill={"red"} />
				<ReferenceDot y={valenceHighestEP.y} x={valenceHighestEP.x} r={5} fill={"green"} />
				{markedLine}
				{memoReferenceLines}
				{memoLines}
				<XAxis type={"number"} dataKey={"x"} tick={false} domain={["dataMin", "dataMax"]} />
				<YAxis
					type={"number"}
					tick={{
						fontSize: 13,
						fontFamily: "monospace",
						fill: "#CBCBCB",
						// dx: -4,
						// dy: -1,
					}}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};
