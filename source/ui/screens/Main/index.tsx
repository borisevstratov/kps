import os from "node:os";
import { Box, Text, useApp, useInput } from "ink";
import { type FC, useState } from "react";
import { connectSshViaCli } from "../../../core/ssh.js";
import type { IConnection } from "../../../types/connection.js";
import BottomPanel from "../../components/BottomPanel/index.js";
import TopPanel from "../../components/TopPanel/index.js";
import { useConnections } from "../../context/DataContext.js";
import ConnectionList from "./components/ConnectionList.js";
import ConnectionPreview from "./components/ConnectionPreview.js";

const MainScreen: FC = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [showInfo, setShowInfo] = useState(false);

	const { exit } = useApp();
	const { connections, removeConnection } = useConnections();

	const conn = connections[selectedIndex] as IConnection;

	useInput((input, key) => {
		if (input === "q") {
			exit();
		}

		if (!conn) {
			return;
		}

		if (key.return) {
			exit();
			return connectSshViaCli(conn);
		}

		if (input === "d") {
			return removeConnection(conn.name);
		}

		if (input === "i") {
			return setShowInfo((prev) => !prev);
		}
	});

	return (
		<Box flexDirection="column" width="100%" height="100%">
			<TopPanel
				leftSlot={
					<>
						<Text color="blue" bold>
							{os.hostname()}
						</Text>
						<Text color="cyan" bold>
							{" "}
							({os.type()})
						</Text>
					</>
				}
			/>
			<Box flexDirection="column" flexGrow={1}>
				{connections.length === 0 && (
					<Text color="red">No connections found. Press q to exit.</Text>
				)}
				{connections.length > 0 && (
					<Box height={"100%"}>
						<ConnectionList
							connections={connections}
							selectedIndex={selectedIndex}
							onSelect={setSelectedIndex}
						/>
						{showInfo && <ConnectionPreview connection={conn} />}
					</Box>
				)}
			</Box>
			<BottomPanel>
				<Box width="100%" justifyContent="space-between">
					<Text>↵ Connect | i Info | d Delete | q Exit</Text>
					<Text dimColor>Edit ~/.kps.json to manage connections</Text>
				</Box>
			</BottomPanel>
		</Box>
	);
};

export default MainScreen;
