#!/usr/bin/env node
import { withFullScreen } from "fullscreen-ink";
import App from "./app.js";
import MainLayout from "./ui/components/MainLayout/index.js";
import { DataProvider } from "./ui/context/DataContext.js";

withFullScreen(
	<DataProvider>
		<MainLayout>
			<App />
		</MainLayout>
	</DataProvider>,
).start();
