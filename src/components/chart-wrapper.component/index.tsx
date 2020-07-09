import * as React from "react";
import DomToImage from "dom-to-image";
import { saveAs } from "file-saver";
import { createUseStyles } from "react-jss";
import { styles } from "./index.css";
import { WatermarkComponent } from "../wmark.component";

const useStyles = createUseStyles(styles);

interface IProps {
	chart: JSX.Element;
}

export const ChartWrapperComponent: React.FC<IProps> = ({
	chart,
}: React.PropsWithChildren<IProps>) => {
	const classes = useStyles();
	const [watermarkEnabled, setWatermark] = React.useState<boolean>();
	const chartWrapperRef = React.useRef<HTMLDivElement>(null);

	const onSaveClick = () => {
		if (!chartWrapperRef.current) {
			return;
		}
		/**
		 * TODO
		 * This could cause an error when converting
		 * DOM to image, find a better solution
		 */
		setWatermark(true);
		DomToImage.toBlob(chartWrapperRef.current).then((blob) => {
			saveAs(blob, "band-structure-graph");
			setWatermark(false);
		});
	};

	return (
		<div className={classes.container}>
			<div ref={chartWrapperRef} className={classes.chartWrapper}>
				{chart}
				{watermarkEnabled ? (
					<div className={classes.watermarkWrapper}>
						<WatermarkComponent />
					</div>
				) : null}
			</div>
			<div className={classes.toolbar}>
				<button className={classes.saveButton} onClick={onSaveClick}>
					Save
				</button>
			</div>
		</div>
	);
};
