import * as React from "react";
import {
	RechartsFunction,
	ReferenceLine,
	ResponsiveContainer,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import { ToolTipComponent } from "../tooltip.component";

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

	const markedLine = chartMarked && markedX && (
		<ReferenceLine
			x={markedX}
			stroke={"#CF6679"}
			strokeWidth={5}
			label={(props) => (
				<ToolTipComponent viewBox={props.viewBox} chartY={chartY as number} value={markedX} />
			)}
		/>
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
