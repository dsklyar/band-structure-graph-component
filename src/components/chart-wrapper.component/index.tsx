import * as React from "react";
import DomToImage from "dom-to-image";
import { saveAs } from "file-saver";
import { createUseStyles } from "react-jss";
import { styles } from "./index.css";
import { WatermarkComponent } from "../wmark.component";
import { SliderComponent } from "../slider.component";
import { IDataInput } from "@/src/utils/model.util";
import { LineChartComponent } from "../line-chart.component";

const useStyles = createUseStyles(styles);

const DEFAULT_AXIS_DOMAIN: IAxisDomainState = {
	dataMin: -10,
	dataMax: 10,
};

interface IProps {
	data: IDataInput;
}

interface IAxisDomainState {
	dataMin: number;
	dataMax: number;
}

export const ChartWrapperComponent: React.FC<IProps> = ({
	data,
}: React.PropsWithChildren<IProps>) => {
	const classes = useStyles();
	const [watermarkEnabled, setWatermark] = React.useState<boolean>();
	const [axisDomain, setAxisDomain] = React.useState<IAxisDomainState>(DEFAULT_AXIS_DOMAIN);
	const chartWrapperRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (chartWrapperRef.current && watermarkEnabled) {
			const promisedBlob = DomToImage.toBlob(chartWrapperRef.current);

			setWatermark(false);

			promisedBlob.then((blob) => {
				saveAs(blob, "band-structure-graph");
			});
		}
	}, [watermarkEnabled]);

	const onSaveClick = () => {
		setWatermark(true);
	};

	const onChangeCapture = (lowValue: number, highValue: number): void => {
		setTimeout(() => {
			setAxisDomain({
				dataMin: lowValue,
				dataMax: highValue,
			});
		}, 150);
	};

	return (
		<div className={classes.container}>
			<div ref={chartWrapperRef} className={classes.chartWrapper}>
				<LineChartComponent data={data} dataMin={axisDomain.dataMin} dataMax={axisDomain.dataMax} />
				{watermarkEnabled ? (
					<div className={classes.watermarkWrapper}>
						<WatermarkComponent />
					</div>
				) : null}
			</div>
			<div className={classes.toolbar}>
				<SliderComponent
					maxValue={10}
					minValue={-10}
					step={1}
					current={{
						low: axisDomain.dataMin,
						high: axisDomain.dataMax,
					}}
					onChangeCapture={onChangeCapture}
				/>
				<button className={classes.saveButton} onClick={onSaveClick}>
					Save
				</button>
			</div>
		</div>
	);
};
