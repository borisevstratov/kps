import { Text } from "ink";
import Spinner from "ink-spinner";
import type { FC } from "react";

type Props = {
	text?: string;
};

const Loader: FC<Props> = (props) => {
	const { text = "Loading..." } = props;

	return (
		<Text>
			<Text color="green">
				<Spinner type="dots" />
			</Text>{" "}
			{text}
		</Text>
	);
};

export default Loader;
