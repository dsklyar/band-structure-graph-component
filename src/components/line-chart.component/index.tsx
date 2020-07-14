import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./index.css";
import {
	LineChart,
	XAxis,
	YAxis,
	Line,
	ResponsiveContainer,
	ReferenceLine,
	ReferenceDot,
} from "recharts";
import { ChatMarkerComponent } from "./chart-marker.component";
import { ModelGenerator, IDataInput } from "../../utils/model.util";

const useStyles = createUseStyles(styles);

interface IProps {
	data: IDataInput;
	dataMin: number;
	dataMax: number;
}

export const LineChartComponent: React.FC<IProps> = ({ data, dataMin, dataMax }: IProps) => {
	const classes = useStyles();

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
				boundary: { low: dataMin, high: dataMax },
			}),
		[data, dataMin, dataMax],
	);

	//#region JSX Function
	const memoLines = Object.keys(legend).map((key) => (
		<Line
			key={key}
			type="monotone"
			dataKey={key}
			dot={false}
			stroke={key.includes("Down") ? "#03DAC5" : "#BB86FC"}
			strokeWidth={2}
			isAnimationActive={false}
		/>
	));

	const memoReferenceLines = Object.keys(referenceLines).map((key, index) => (
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
	));

	const conductionRefDot = (
		<ReferenceDot
			y={conductionLowestEP.y}
			x={conductionLowestEP.x}
			r={7}
			stroke={"#FD413C"}
			fill={"#FD413C"}
			fillOpacity={0.5}
		/>
	);

	const valenceRefDot = (
		<ReferenceDot
			y={valenceHighestEP.y}
			x={valenceHighestEP.x}
			r={7}
			stroke={"#FD413C"}
			fill={"#FD413C"}
			fillOpacity={0.5}
		/>
	);

	const fermiEnergyLine = (
		<ReferenceLine y={fermiLine} stroke={"lightblue"} strokeWidth={3} strokeDasharray="3 3" />
	);

	//#endregion

	return (
		<div className={classes.container}>
			<div className={classes.chart}>
				<ResponsiveContainer>
					<LineChart data={records} margin={{ left: -40, right: 10 }}>
						{fermiEnergyLine}
						{conductionRefDot}
						{valenceRefDot}
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
							domain={[dataMin, dataMax]}
							tick={{
								fontSize: 13,
								fontFamily: "monospace",
								fill: "#CBCBCB",
							}}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
			<div className={classes.chart}>
				<ChatMarkerComponent records={records} />
			</div>
		</div>
	);
};
