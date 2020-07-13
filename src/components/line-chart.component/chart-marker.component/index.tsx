import * as React from "react";
import {
	RechartsFunction,
	ReferenceLine,
	ResponsiveContainer,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";

interface IProps {
	records: Record<string, number>[];
}

interface IMarkState {
	markedX: number | null;
	chartX: number | null;
	chartY: number | null;
	chartMarked: boolean;
}

interface RechartsFuncEvent {
	activeLabel: number;
	chartX: number;
	chartY: number;
}

export const ChatMarkerComponent: React.FC<IProps> = React.memo(({ records }: IProps) => {
	//#region Hooks

	const [{ markedX, chartMarked, chartY }, setMarkedState] = React.useState<IMarkState>({
		markedX: null,
		chartX: null,
		chartY: null,
		chartMarked: false,
	});
	//#endregion

	//#region Handlers
	const onChartClick: RechartsFunction = (e: RechartsFuncEvent) => {
		console.log(e);
		if (!e) {
			return;
		}
		setMarkedState({
			chartMarked: !chartMarked,
			markedX: !chartMarked ? e.activeLabel : null,
			chartX: !chartMarked ? e.chartX : null,
			chartY: !chartMarked ? e.chartY : null,
		});
	};
	//#endregion

	//#region JSX

	const customLabel = ({ viewBox: { x, y } }: any) => {
		console.log(x, y);
		return (
			<svg x={x} y={chartY as number}>
				<g>
					{/* <rect x="0" y="0" width="40" height="15" fill="grey"></rect> */}
					<foreignObject x="0" y="0" width="48.5" height="15">
						<div
							style={{
								display: "flex",
							}}
						>
							<div
								style={{
									width: 0,
									height: 0,
									borderTop: "7.5px solid transparent",
									borderBottom: "7.5px solid transparent",
									borderRight: "7.5px solid grey",
								}}
							/>
							<div
								style={{
									width: 40,
									height: 15,
									borderTopRightRadius: 4,
									borderBottomRightRadius: 4,
									backgroundColor: "grey",
									justifyContent: "center",
									display: "flex",
								}}
							>
								<span
									style={{
										fontFamily: "monospace",
										fontSize: 12,
										color: "#FFF",
									}}
								>
									{markedX?.toFixed(3)}
								</span>
							</div>
						</div>
					</foreignObject>
				</g>
			</svg>
		);
	};

	const markedLine = chartMarked && markedX && (
		<ReferenceLine x={markedX} stroke={"#CF6679"} strokeWidth={5} label={customLabel} />
	);
	//#endregion

	return (
		<ResponsiveContainer>
			<LineChart
				data={records}
				margin={{ left: -40, right: 10 }}
				onClick={onChartClick}
				style={{ cursor: "pointer" }}
			>
				{markedLine}
				<XAxis type={"number"} dataKey={"x"} tick={false} domain={["dataMin", "dataMax"]} />
				<YAxis type={"number"} tick={false} />
			</LineChart>
		</ResponsiveContainer>
	);
});

ChatMarkerComponent.displayName = "WarpComponent";
