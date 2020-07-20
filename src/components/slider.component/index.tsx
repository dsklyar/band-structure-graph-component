import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./index.css";

const useStyles = createUseStyles(styles);

enum MouseButton {
	Right = 2,
	Middle = 1,
	Left = 0,
}

interface IProps {
	minValue: number;
	maxValue: number;
	step: number;
	current: {
		low: number;
		high: number;
	};
	onChangeCapture?: (lowValue: number, highValue: number) => void;
}

interface IThumbsState {
	boundaries: { [key: string]: { value: number } };
	selected: string | undefined;
}

export const SliderComponent: React.FC<IProps> = React.memo(
	({ minValue, maxValue, step, current: { low, high }, onChangeCapture }: IProps) => {
		const classes = useStyles();

		const lowHandleRef = React.useRef<HTMLDivElement>(null);
		const highHandleRef = React.useRef<HTMLDivElement>(null);
		const containerRef = React.useRef<HTMLDivElement>(null);
		const [mouseDown, setMouseDown] = React.useState<boolean>(false);
		const [thumbsState, setThumbsState] = React.useState<IThumbsState>({
			selected: undefined,
			boundaries: {
				low: { value: low },
				high: { value: high },
			},
		});

		//#region Document useEffect cbs

		const onMouseUpHandle = React.useCallback(
			(e: MouseEvent): void => {
				if (e.button === MouseButton.Left && mouseDown) {
					setMouseDown(false);
					setThumbsState({
						...thumbsState,
						selected: undefined,
					});

					if (onChangeCapture) {
						const hasChanged =
							thumbsState.boundaries["low"].value !== low ||
							thumbsState.boundaries["high"].value !== high;

						hasChanged &&
							setTimeout(() => {
								onChangeCapture(
									thumbsState.boundaries["low"].value,
									thumbsState.boundaries["high"].value,
								);
							}, 100);
					}
				}
			},
			[high, low, mouseDown, onChangeCapture, thumbsState],
		);
		const onMouseDownHandle = React.useCallback(
			(e: MouseEvent): void => {
				if (lowHandleRef.current?.contains(e.target as Node | null)) {
					setThumbsState({
						...thumbsState,
						selected: "low",
					});
				}
				if (highHandleRef.current?.contains(e.target as Node | null)) {
					setThumbsState({
						...thumbsState,
						selected: "high",
					});
				}
				if (
					lowHandleRef.current?.contains(e.target as Node | null) ||
					highHandleRef.current?.contains(e.target as Node | null)
				) {
					if (e.button === MouseButton.Left) {
						setMouseDown(true);
					}
				}
			},
			[thumbsState],
		);
		const onMouseClickHandle = React.useCallback(
			(e: MouseEvent): void => {
				const rect = containerRef.current?.getBoundingClientRect();

				// TODO Needs refactoring

				if (!rect || !containerRef.current?.contains(e.target as Node | null)) {
					return;
				}

				const curLow = thumbsState.boundaries["low"].value;
				const curHigh = thumbsState.boundaries["high"].value;

				const [start, end] = [rect.left, rect.right];
				const valueRange = maxValue - minValue;
				const pixelRange = end - start;

				const isSafe = start <= e.x && e.x <= end;

				const pixelPercent = (e.x - start) / pixelRange;
				const value = pixelPercent * valueRange - Math.abs(minValue);

				const tickRemainder = value / step - Math.floor(value / step);
				const isNextTick = tickRemainder >= 0.5;

				const tickedValue = isNextTick ? Math.floor(value / step) + 1 : Math.floor(value / step);

				const isLowThumbCloser = Math.abs(low - value) < Math.abs(high - value);
				const otherHandleValue = isLowThumbCloser ? curHigh : curLow;

				const isOverlapping = isLowThumbCloser
					? otherHandleValue <= tickedValue
					: tickedValue <= otherHandleValue;

				const thumbKey = isLowThumbCloser ? "low" : "high";

				isSafe && !isOverlapping
					? setThumbsState({
							...thumbsState,
							boundaries: {
								...thumbsState.boundaries,
								[thumbKey]: { value: tickedValue },
							},
					  })
					: null;

				if (onChangeCapture && isSafe && !isOverlapping) {
					const hasChanged = thumbsState.boundaries[thumbKey].value !== tickedValue;

					hasChanged &&
						setTimeout(() => {
							thumbKey === "low"
								? onChangeCapture(tickedValue, thumbsState.boundaries["high"].value)
								: onChangeCapture(thumbsState.boundaries["low"].value, tickedValue);
						}, 100);
				}
			},
			[high, low, maxValue, minValue, onChangeCapture, step, thumbsState],
		);
		const onMouseMoveHandle = React.useCallback(
			(e: MouseEvent): void => {
				const rect = containerRef.current?.getBoundingClientRect();
				if (!mouseDown || !rect || !thumbsState.selected) {
					return;
				}

				const curLow = thumbsState.boundaries["low"].value;
				const curHigh = thumbsState.boundaries["high"].value;

				const [start, end] = [rect.left, rect.right];
				const valueRange = maxValue - minValue;
				const pixelRange = end - start;

				const isSafe = start <= e.x && e.x <= end;

				const pixelPercent = (e.x - start) / pixelRange;
				const value = pixelPercent * valueRange - Math.abs(minValue);

				const tickRemainder = value / step - Math.floor(value / step);
				const isNextTick = tickRemainder >= 0.5;

				const tickedValue = isNextTick ? Math.floor(value / step) + 1 : Math.floor(value / step);

				const isLowThumbSelected = thumbsState.selected === "low";

				const otherHandleValue = isLowThumbSelected ? curHigh : curLow;

				const isOverlapping = isLowThumbSelected
					? otherHandleValue <= tickedValue
					: tickedValue <= otherHandleValue;

				isSafe && !isOverlapping
					? setThumbsState({
							...thumbsState,
							boundaries: {
								...thumbsState.boundaries,
								[thumbsState.selected]: { value: tickedValue },
							},
					  })
					: null;
			},
			[maxValue, minValue, mouseDown, step, thumbsState],
		);

		//#endregion

		React.useEffect(() => {
			document.addEventListener("mouseup", onMouseUpHandle);
			document.addEventListener("mousedown", onMouseDownHandle);
			document.addEventListener("mousemove", onMouseMoveHandle);
			document.addEventListener("click", onMouseClickHandle);

			return () => {
				document.removeEventListener("mouseup", onMouseUpHandle);
				document.removeEventListener("mousedown", onMouseDownHandle);
				document.removeEventListener("mousemove", onMouseMoveHandle);
				document.removeEventListener("click", onMouseClickHandle);
			};
		}, [onMouseUpHandle, onMouseDownHandle, onMouseMoveHandle, onMouseClickHandle]);

		//#region Generation of positioning styles

		const genThumbStyle = (handleId: string): React.CSSProperties | undefined => {
			const data = thumbsState.boundaries[handleId];
			if (data) {
				const fullRange = maxValue - minValue;
				const isPositive = data.value >= 0;
				const value = isPositive
					? data.value + Math.abs(minValue)
					: Math.abs(minValue) - Math.abs(data.value);
				const percent = (value / fullRange) * 100;
				return {
					left: `${percent}%`,
				};
			} else {
				return undefined;
			}
		};

		const genTrackStyle = (): React.CSSProperties | undefined => {
			const percentRange: number | undefined = Object.keys(thumbsState.boundaries).reduce(
				(acc, key) => {
					const data = thumbsState.boundaries[key];
					const fullRange = maxValue - minValue;
					const isPositive = data.value >= 0;
					const value = isPositive
						? data.value + Math.abs(minValue)
						: Math.abs(minValue) - Math.abs(data.value);
					const percent = value / fullRange;

					if (acc === undefined) {
						acc = percent;
					} else {
						if (acc > percent) {
							acc -= percent;
						}
						if (acc < percent) {
							acc = percent - acc;
						}
					}

					return acc;
				},
				undefined as number | undefined,
			);

			if (percentRange) {
				return {
					width: `calc(${percentRange} * 240px)`,
					...genThumbStyle("low"),
				};
			} else {
				return undefined;
			}
		};

		//#endregion

		//#region  Generation of tick markers

		const genTicks = (): React.ReactNode => {
			const CUSTOM_SCALE_VALUE = 4;

			const fullRange = maxValue - minValue;
			const tickCount = fullRange / step / CUSTOM_SCALE_VALUE;
			const retval = [];

			const curLow = Math.abs(minValue) + thumbsState.boundaries["low"].value;
			const curHigh = Math.abs(minValue) + thumbsState.boundaries["high"].value;

			for (let i = 0; i < tickCount; i++) {
				const tickValue = i * step * CUSTOM_SCALE_VALUE;
				if (tickValue < curLow || tickValue > curHigh) {
					retval.push({ key: `tick-${i}`, light: true, left: `${i * (100 / tickCount)}%` });
				} else if (tickValue > curLow && tickValue < curHigh) {
					retval.push({ key: `tick-${i}`, light: false, left: `${i * (100 / tickCount)}%` });
				}
			}
			return (
				<>
					{retval.map(({ key, light, left }) => (
						<span
							key={key}
							className={light ? classes.lightTick : classes.darkTick}
							style={{ left }}
						/>
					))}
				</>
			);
		};

		//#endregion

		return (
			<div className={classes.spec}>
				<div ref={containerRef} className={classes.container}>
					<div className={classes.rail} />
					<div className={classes.track} style={genTrackStyle()} />
					{genTicks()}
					<div
						ref={lowHandleRef}
						className={
							mouseDown && thumbsState.selected === "low"
								? classes.thumbActive
								: classes.thumbInactive
						}
						style={genThumbStyle("low")}
					/>
					<div
						ref={highHandleRef}
						className={
							mouseDown && thumbsState.selected === "high"
								? classes.thumbActive
								: classes.thumbInactive
						}
						style={genThumbStyle("high")}
					/>
				</div>
			</div>
		);
	},
);

SliderComponent.displayName = "SliderComponent";
