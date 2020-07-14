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
		transition: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
	},
	thumbInactive: {
		extend: "thumb",
		"&:hover": {
			boxShadow: "0px 0px 0px 8px rgba(253, 65, 60, 0.16)",
		},
	},
	thumbActive: {
		extend: "thumb",
		boxShadow: "0px 0px 0px 14px rgba(253, 65, 60, 0.16)",
	},
	tick: {
		height: 2,
		width: 2,
		position: "absolute",
		backgroundColor: "#342C2F",
	},
};
