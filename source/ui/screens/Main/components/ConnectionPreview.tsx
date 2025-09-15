import { Box, Newline, Text } from "ink";
import type { FC } from "react";
import type { IConnection } from "../../../../types/connection.js";

type Props = {
	connection: IConnection;
};

const ConnectionPreview: FC<Props> = (props) => {
	const { connection } = props;

	return (
		<Box
			borderStyle={"round"}
			height={"100%"}
			width={75}
			flexDirection={"column"}
			paddingTop={1}
			paddingBottom={1}
			paddingLeft={2}
			paddingRight={2}
		>
			<Text bold>📋 Connection Details</Text>
			<Newline count={1} />

			<Text>Name: {connection.name}</Text>
			<Text>User: {connection.user}</Text>
			<Text>Host: {connection.host}</Text>
			<Text>Port: {connection.port || 22}</Text>
			{connection.password && <Text>Password: {connection.password}</Text>}
			{connection.privateKey && <Text>Identity: {connection.privateKey}</Text>}
		</Box>
	);
};

export default ConnectionPreview;
