export const styles = {
	spec: {
		width: 240,
		padding: 8,
		display: "inline-block",
	},
	container: {
		width: "100%",
		position: "relative",
		color: "#FD413C",
		cursor: "pointer",
		padding: "13px 0",
		height: 2,
	},
	// Rail is the whole line
	rail: {
		width: "100%",
		height: 2,
		position: "absolute",
		backgroundColor: "#342C2F",
	},
	// Track is the used up line
	track: {
		height: 2,
		position: "absolute",
		borderRadius: 1,
		backgroundColor: "#FD413C",
		opacity: 0.7,
	},
	thumb: {
		width: 12,
		height: 12,
		position: "absolute",
		marginTop: -5,
		marginLeft: -6, // -1 * (12 / 2) = -6 pixel shift to center thumb on rail
		borderRadius: "50%",
		backgroundColor: "#FD413C",
		userSelect: "none",
	},
};
