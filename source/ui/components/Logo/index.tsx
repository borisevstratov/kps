import { createRequire } from "node:module";
import { Text } from "ink";

const require = createRequire(import.meta.url);
const packageJson = require("../../../../package.json");

const Logo = () => {
	return (
		<>
			<Text color="cyan">🔌 kps v{packageJson.version}</Text>
			<Text dimColor> | </Text>
		</>
	);
};

export default Logo;
