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
	chartX: number;
	chartY: number;
}

interface IProps {
	data: IDataInput;
}

interface IMarkState {
	markedX: number | null;
	chartX: number | null;
	chartY: number | null;
	chartMarked: boolean;
}

export const LineChartComponent: React.FC<IProps> = ({ data }: IProps) => {
	//#region Hooks
	const classes = useStyles();
	const [{ markedX, chartMarked, chartY }, setMarkedState] = React.useState<IMarkState>({
		markedX: null,
		chartX: null,
		chartY: null,
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
		console.log(e);
		setMarkedState({
			chartMarked: !chartMarked,
			markedX: !chartMarked ? e.activeLabel : null,
			chartX: !chartMarked ? e.chartX : null,
			chartY: !chartMarked ? e.chartY : null,
		});
	};
	//#endregion

	//#region JSX Function
	/**
	 * TODO
	 * Find a solution to memo this draw
	 * indore to reduce rerender when updating
	 * the charts!
	 * Note: Fragments dont work with recharts
	 */
	const memoLines = React.useMemo(
		() =>
			Object.keys(legend).map((key) => (
				<Line
					key={key}
					type="monotone"
					dataKey={key}
					dot={false}
					stroke={key.includes("Down") ? "#03DAC5" : "#BB86FC"}
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
					stroke={"#999"}
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

	/**
	 * TODO
	 * Move this class into a separate file
	 * Add IProps
	 */
	const customLabel = ({ viewBox: { x, y } }: any) => {
		console.log(x, y);
		return (
			<text
				x={x}
				y={chartY as number}
				dx={-20}
				fill={"white"}
				fontSize={10}
				style={{
					fontFamily: "monospace",
					fontSize: 12,
					color: "#000",
				}}
				textAnchor="middle"
			>
				{markedX?.toFixed(3)}
			</text>
		);
	};

	const markedLine = chartMarked && markedX && (
		<ReferenceLine x={markedX} stroke={"#CF6679"} strokeWidth={5} label={customLabel} />
	);

	//#endregion

	return (
		<ResponsiveContainer>
			<LineChart data={records} margin={{ left: -40, right: 10 }} onClick={onChartClick}>
				<ReferenceLine y={fermiLine} stroke={"lightblue"} strokeWidth={3} strokeDasharray="3 3" />
				<ReferenceDot
					y={conductionLowestEP.y}
					x={conductionLowestEP.x}
					r={7}
					stroke={"#FD413C"}
					fill={"#FD413C"}
					fillOpacity={0.5}
				/>
				<ReferenceDot
					y={valenceHighestEP.y}
					x={valenceHighestEP.x}
					r={7}
					stroke={"#FD413C"}
					fill={"#FD413C"}
					fillOpacity={0.5}
				/>
				{markedLine}
				{memoReferenceLines}
				{memoLines}
				<XAxis
					type={"number"}
					dataKey={"x"}
					tick={false}
					domain={["dataMin", "dataMax"]}
					label={{
						dy: 9,
						value: "Wave Vector",
						fontSize: 14,
						fontFamily: "monospace",
						fill: "#999",
					}}
				/>
				<YAxis
					type={"number"}
					tick={{
						fontSize: 13,
						fontFamily: "monospace",
						fill: "#CBCBCB",
					}}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};
