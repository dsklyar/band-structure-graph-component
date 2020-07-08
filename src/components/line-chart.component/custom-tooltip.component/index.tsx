import * as React from "react";

interface IProps {
	active?: boolean;
	activeHold?: boolean;
	payload?: any;
	label?: string;
}

export const CustomToolTip: React.FC<IProps> = ({ active, payload, label, activeHold }: IProps) => {
	if (active || activeHold) {
		return (
			<div className="custom-tooltip">
				<p className="label">{`${label} : ${payload[0]?.value}`}</p>
				<p className="intro">{label}</p>
			</div>
		);
	}

	return null;
};
