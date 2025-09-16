import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import type { IConnection } from "../types/connection.js";
import { readSshConfigAndPersist } from "./ssh.js";

export const DB_CONFIG_FILE = path.join(os.homedir(), ".kps.json");

interface Data {
	connections: IConnection[];
}

const adapter = new JSONFile<Data>(DB_CONFIG_FILE);
export const db = new Low<Data>(adapter, { connections: [] });

export async function initDB() {
	if (!fs.existsSync(DB_CONFIG_FILE)) {
		readSshConfigAndPersist();
	}

	await db.read();
	if (!db.data) {
		db.data = { connections: [] };
		await db.write();
	}

	return db;
}
