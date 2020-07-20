export const styles = {
	container: {
		width: 600,
		height: 370,
		padding: 10,
		boxSizing: "border-box",
		backgroundColor: "#1E1E1E",
	},
	chartWrapper: {
		width: "100%",
		height: 300,
		position: "relative",
		backgroundColor: "#1E1E1E",
	},
	toolbar: {
		height: 50,
		padding: "0px 10px",
		display: "flex",
		alignItems: "center",
	},
	watermarkWrapper: {
		position: "absolute",
		opacity: 0.5,
		bottom: "5%",
		right: "5%",
	},
	saveButton: {
		height: 30,
		width: 60,
		borderRadius: 15,
		backgroundColor: "#342C2F",
		margin: 10,
		marginLeft: "auto",
		color: "#FD413C",
		fontWeight: "bold",
		fontFamily: "monospace",
		fontSize: 15,
		userSelect: "none",
		transition: "box-shadow .2s ease-in-out",
		"&:hover": {
			boxShadow: "0px 0px 5px 1px black",
		},
	},
};
