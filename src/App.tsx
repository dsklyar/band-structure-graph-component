import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./App.css";
import { ChartWrapperComponent } from "./components/chart-wrapper.component";
import { LineChartComponent } from "./components/line-chart.component";
import data from "../newData.json";

const useStyles = createUseStyles(styles);

export const App: React.FC = () => {
	const classes = useStyles();

	const chart = <LineChartComponent data={data} />;

	return (
		<div className={classes.container}>
			<ChartWrapperComponent chart={chart} />
		</div>
	);
};
