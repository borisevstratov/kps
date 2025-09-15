import Loader from "./ui/components/Loader/index.js";
import { useConnections } from "./ui/context/DataContext.js";
import MainScreen from "./ui/screens/Main/index.js";

export default function App() {
	const { loading } = useConnections();

	if (loading) {
		return <Loader />;
	}

	return <MainScreen />;
}
