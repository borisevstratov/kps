import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Client, type ConnectConfig } from "ssh2";
import type { IConnection } from "../types/connection.js";
import { DB_CONFIG_FILE } from "./db.js";

export async function connectSshViaCli(connection: IConnection) {
	const conn = new Client();

	conn.on("ready", () => {
		conn.shell((err, stream) => {
			if (err) {
				throw err;
			}

			// Setup raw stdin
			if (process.stdin.isTTY) {
				process.stdin.setRawMode(true);
			}
			process.stdin.resume();

			process.stdin.pipe(stream);
			stream.pipe(process.stdout);

			// Handle resize
			process.stdout.on("resize", () => {
				stream.setWindow(process.stdout.rows, process.stdout.columns, 0, 0);
			});

			stream.on("close", () => {
				// Reset stdin before returning
				if (process.stdin.isTTY) {
					process.stdin.setRawMode(false);
				}
				process.stdin.pause();

				conn.end();
			});
		});
	});

	conn.on("error", (err) => {
		console.error("SSH error:", err.message);
	});

	const sshConfig: ConnectConfig = {
		host: connection.host,
		port: connection.port || 22,
		username: connection.user,
		hostVerifier: () => true,
	};

	if (connection.password) {
		sshConfig.password = connection.password;
	} else if (connection.privateKey) {
		sshConfig.privateKey = fs.readFileSync(connection.privateKey);
	} else {
		throw new Error("No auth method provided");
	}

	conn.connect(sshConfig);
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
