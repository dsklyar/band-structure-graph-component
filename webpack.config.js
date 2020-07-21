/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	// mode: "production",

	// Enable sourcemaps for debugging webpack's output.
	// devtool: "source-map",

	entry: "./src/index",
	output: {
		path: path.join(__dirname, "/dist"),
		filename: "bundle.js",
	},

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".ts", ".tsx", ".js"],
	},

	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "awesome-typescript-loader",
					},
				],
			},
			// {
			// 	test: /\.min.css$/i,
			// 	use: ["css-loader"],
			// },
			// {
			// 	test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
			// 	// include: [path.join(__dirname, "src/assets")],
			// 	loader: "file-loader?name=assets/[name].[ext]",
			// },
			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			// {
			//   enforce: "pre",
			//   test: /\.js$/,
			//   loader: "source-map-loader",
			// },
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
	],

	// When importing a module whose path matches one of the following, just
	// assume a corresponding global variable exists and use that instead.
	// This is important because it allows us to avoid bundling all of our
	// dependencies, which allows browsers to cache those libraries between builds.
	externals: {},
};
