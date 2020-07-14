import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./index.css";

const useStyles = createUseStyles(styles);

interface IProps {
	viewBox: { x: number; y: number };
	chartY: number;
	value: number;
}

export const ToolTipComponent: React.FC<IProps> = ({ viewBox: { x }, chartY, value }: IProps) => {
	const classes = useStyles();
	return (
		<svg x={x} y={chartY}>
			<foreignObject x="0" y="0" width="48.5" height="15">
				<div className={classes.wrapper}>
					<div className={classes.triangle} />
					<div className={classes.backdrop}>
						<span className={classes.text}>{value.toFixed(3)}</span>
					</div>
				</div>
			</foreignObject>
		</svg>
	);
};
