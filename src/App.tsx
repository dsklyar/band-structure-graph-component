import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./App.css";
import { ChartWrapperComponent } from "./components/chart-wrapper.component";
import { LineChartComponent } from "./components/line-chart.component";
import { CardComponent } from "./components/card.component";
import data from "../data.json";

const useStyles = createUseStyles(styles);

export const App: React.FC = () => {
	const classes = useStyles();

	const chart = <LineChartComponent data={data} />;

	return (
		<div>
			<CardComponent>
				<ChartWrapperComponent chart={chart} />
			</CardComponent>
			<br />
			<CardComponent>
				<div className={classes.helper}>
					<div>How to use:</div>
					<div>1. Click once on the graph to display mark line</div>
					<div>2. Click save button</div>
					<div>3. Click once on the graph to hide the graph mark </div>
				</div>
			</CardComponent>
		</div>
	);
};
