import { Box, Text } from "ink";
import type { FC } from "react";
import type { IMetrics } from "../../../types/common.js";
import Logo from "../Logo/index.js";

type Props = {
	metrics: IMetrics;
};

const TopPanel: FC<Props> = (props) => {
	const { metrics } = props;
	const { hostname, type, cpu, ram, disk } = metrics;

	return (
		<Box
			width="100%"
			paddingX={1}
			borderStyle="round"
			borderColor="cyan"
			justifyContent="space-between"
		>
			<Box>
				<Logo />
				<Text color="blue" bold>
					{hostname}
				</Text>
				<Text color="cyan" bold>
					{" "}
					({type})
				</Text>
			</Box>
			<Box>
				<Text dimColor>
					CPU: {cpu} | RAM: {ram} | Disk: {disk}
				</Text>
			</Box>
		</Box>
	);
};

export default TopPanel;
