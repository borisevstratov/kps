import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { IConnection } from "../types/connection.js";
import { DB_CONFIG_FILE } from "./db.js";

export async function connectViaCli(connection: IConnection) {
	let sshCommand: string;
	if (connection.password) {
		sshCommand = `sshpass -p "${connection.password}" ssh -o StrictHostKeyChecking=no`;
		if (connection.port && connection.port !== 22) {
			sshCommand += ` -p ${connection.port}`;
		}
		sshCommand += ` ${connection.user}@${connection.host}`;
	} else if (connection.privateKey) {
		sshCommand = `ssh -i "${connection.privateKey}" -o StrictHostKeyChecking=no`;
		if (connection.port && connection.port !== 22) {
			sshCommand += ` -p ${connection.port}`;
		}
		sshCommand += ` ${connection.user}@${connection.host}`;
	} else {
		return;
	}

	const sshProcess = spawn(sshCommand, [], {
		stdio: "inherit",
		shell: true,
	});

	sshProcess.on("error", (error) => {
		console.error("Failed to start SSH process:", error);
	});
}

export function readSshConfigAndPersist(): void {
	const sshConfigPath = path.join(os.homedir(), ".ssh", "config");

	if (!fs.existsSync(sshConfigPath)) {
		throw new Error(`SSH config not found at ${sshConfigPath}`);
	}

	const content = fs.readFileSync(sshConfigPath, "utf-8");
	const lines = content.split("\n");

	const connections: IConnection[] = [];
	let current: Partial<IConnection> = {};

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;

		const [key, ...rest] = trimmed.split(/\s+/);
		const value = rest.join(" ");

		switch (key?.toLowerCase()) {
			case "host":
				// push previous host
				if (current.name && current.host && current.user) {
					connections.push(current as IConnection);
				}
				current = { name: value, host: undefined, user: undefined };
				break;
			case "hostname":
				current.host = value;
				break;
			case "user":
				current.user = value;
				break;
			case "port":
				current.port = parseInt(value, 10);
				break;
			case "identityfile":
				current.privateKey = value;
				break;
			case "pass":
			case "password":
				current.password = value;
				break;
		}
	}

	if (current.name && current.host && current.user) {
		connections.push(current as IConnection);
	}

	fs.writeFileSync(
		DB_CONFIG_FILE,
		JSON.stringify({ connections }, null, 2),
		"utf-8",
	);
	console.log(
		`Exported ${connections.length} connections to ${DB_CONFIG_FILE}`,
	);
}
