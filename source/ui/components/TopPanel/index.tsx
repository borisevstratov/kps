import { Box } from "ink";
import type { FC, ReactNode } from "react";
import Logo from "../Logo/index.js";

type Props = {
	leftSlot?: ReactNode;
	rightSlot?: ReactNode;
};

const TopPanel: FC<Props> = (props) => {
	const { leftSlot, rightSlot } = props;

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
				{leftSlot}
			</Box>
			<Box>{rightSlot}</Box>
		</Box>
	);
};

export default TopPanel;
