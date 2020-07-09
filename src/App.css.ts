export const styles = {
	container: {
		backgroundColor: "#000",
		height: "100vh",
	},
	"@global": {
		button: {
			padding: 0,
			border: "none",
			font: "inherit",
			color: "inherit",
			outline: "none",
			backgroundColor: "transparent",
			/* show a hand cursor on hover, some argue that we
			should keep the default arrow cursor for buttons */
			cursor: "pointer",
		},
		"body, #app": {
			margin: 0,
			padding: 0,
			height: "100vh",
			width: "100vw",
			backgroundColor: "#000",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		},
	},
	header: {
		width: 600,
		height: 80,
		backgroundColor: "#1E1E1E",
		padding: 15,
		boxSizing: "border-box",
		"& div": {
			color: "grey",
			fontSize: 13,
			fontFamily: "monospace",
			// marginTop: 3,
			padding: {
				left: 10,
				right: 10,
			},
		},
		"& div:first-child": {
			color: "#CBCBCB",
			fontSize: 26,
			margin: 0,
		},
	},
	helper: {
		width: 600,
		height: 160,
		backgroundColor: "#1E1E1E",
		padding: 15,
		boxSizing: "border-box",
		"& div": {
			color: "#CBCBCB",
			fontSize: 13,
			fontFamily: "monospace",
			marginTop: 15,
			padding: {
				left: 10,
				right: 10,
			},
		},
		"& div:first-child": {
			fontSize: 20,
			margin: 0,
		},
	},
	br: {
		margin: 20,
	},
};
