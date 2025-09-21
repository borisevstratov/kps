import { Box } from "ink";
import type { FC, PropsWithChildren } from "react";

const MainLayout: FC<PropsWithChildren> = (props) => {
	return (
		<Box width={"100%"} height={"95%"} marginTop={1}>
			{props.children}
		</Box>
	);
};

export default MainLayout;
