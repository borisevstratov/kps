import { Box } from "ink";
import type { FC, PropsWithChildren } from "react";

const BottomPanel: FC<PropsWithChildren> = (props) => {
	const { children } = props;

	return (
		<Box
			width="100%"
			paddingX={1}
			borderStyle="round"
			borderColor="cyan"
			justifyContent="space-between"
		>
			{children}
		</Box>
	);
};

export default BottomPanel;
