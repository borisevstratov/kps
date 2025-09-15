import fs from "node:fs";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { DB_CONFIG_FILE, db, initDB } from "../../core/db.js";
import type { IConnection } from "../../types/connection.js";

interface DataContextValue {
	connections: IConnection[];
	addConnection: (c: IConnection) => Promise<void>;
	removeConnection: (name: string) => Promise<void>;
	reload: () => Promise<void>;
	loading: boolean;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [connections, setConnections] = useState<IConnection[]>([]);
	const [loading, setLoading] = useState(true);

	// Initial load
	useEffect(() => {
		(async () => {
			await initDB();
			setConnections(db.data.connections);
			setLoading(false);
		})();

		// Watch file changes
		const watcher = fs.watch(DB_CONFIG_FILE, async (eventType) => {
			if (eventType === "change") {
				try {
					await db.read();
					setConnections([...db.data.connections]);
				} catch (err) {
					console.error("Failed to reload DB on file change:", err);
				}
			}
		});

		return () => watcher.close();
	}, []);

	const addConnection = async (c: IConnection) => {
		db.data.connections.push(c);
		await db.write();
		setConnections([...db.data.connections]);
	};

	const removeConnection = async (name: string) => {
		db.data.connections = db.data.connections.filter((c) => c.name !== name);
		await db.write();
		setConnections([...db.data.connections]);
	};

	const reload = async () => {
		await db.read();
		setConnections([...db.data.connections]);
	};

	return (
		<DataContext.Provider
			value={{ connections, addConnection, removeConnection, reload, loading }}
		>
			{children}
		</DataContext.Provider>
	);
};

export function useConnections() {
	const ctx = useContext(DataContext);
	if (!ctx) {
		throw new Error("useConnections must be used inside <DataProvider>");
	}
	return ctx;
}
