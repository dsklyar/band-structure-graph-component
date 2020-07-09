import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./index.css";

const useStyles = createUseStyles(styles);

export const CardComponent: React.FC<React.PropsWithChildren<unknown>> = ({
	children,
}: React.PropsWithChildren<unknown>) => {
	const classes = useStyles();

	return <div className={classes.container}>{children}</div>;
};
