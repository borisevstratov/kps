import { Box, Newline, Text } from "ink";
import SelectInput from "ink-select-input";
import type { FC } from "react";
import type { IConnection } from "../../../../types/connection.js";

type Props = {
	connections: IConnection[];
	selectedIndex: number;
	onSelect: (index: number) => void;
};

const ConnectionList: FC<Props> = (props) => {
	const { connections, selectedIndex, onSelect } = props;

	return (
		<Box
			borderStyle={"round"}
			height={"100%"}
			width={"100%"}
			paddingTop={1}
			paddingBottom={1}
			paddingLeft={2}
			paddingRight={2}
			flexDirection={"column"}
		>
			<Text bold>🔗 Your SSH targets</Text>
			<Newline count={1} />

			<SelectInput
				items={connections.map((c, i) => ({
					label: `${c.name} (${c.user}@${c.host})`,
					value: String(i),
				}))}
				initialIndex={selectedIndex}
				onHighlight={(item) => onSelect(Number(item.value))}
			/>
		</Box>
	);
};

export default ConnectionList;
