import * as React from "react";
import {
	LineChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Line,
	Tooltip,
	RechartsFunction,
	ResponsiveContainer,
} from "recharts";
import { ModelGenerator, IDataInput } from "./model";
import { CustomToolTip } from "./custom-tooltip.component";

interface RechartsFuncEvent {
	activeCoordinate: {
		x: number;
		y: number;
	};
	activePayload: Array<{
		dataKey: string;
	}>;
}

interface IProps {
	data: IDataInput;
}

export const LineChartComponent: React.FC<IProps> = ({ data }: IProps) => {
	// const [activeHold, setActiveHold] = React.useState<boolean>(false);

	const modelGen = new ModelGenerator();
	const { legend, records } = modelGen.generateModel(data, { boundary: { low: -4, high: 6 } });

	const onChartClick: RechartsFunction = (e: RechartsFuncEvent) => {
		console.log(e);
		// setActiveHold(!activeHold);
	};

	const tooltip = <CustomToolTip />;

	return (
		<ResponsiveContainer>
			<LineChart
				data={records}
				onClick={onChartClick}
				margin={{ top: 20, right: 15, left: 15, bottom: 15 }}
			>
				{/* <CartesianGrid strokeDasharray="4 1" /> */}
				<XAxis dataKey="x" tick={false} label={"Wave Vector"} />
				<YAxis type="number" domain={["dataMin", "dataMax"]} />
				<Tooltip content={tooltip} />
				{Object.keys(legend).map((key) => (
					<Line
						key={key}
						type="monotone"
						dataKey={key}
						dot={false}
						stroke={"#dedede"}
						strokeWidth={2}
					/>
				))}
			</LineChart>
		</ResponsiveContainer>
	);
};
