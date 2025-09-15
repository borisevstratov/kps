import fs from "node:fs";
import { useEffect, useState } from "react";
import { Client } from "ssh2";
import type { IMetrics, IStatus } from "../types/common.js";
import type { IConnection } from "../types/connection.js";

export const useRemoteMetrics = (
	connection: IConnection,
	intervalMs = 2_000,
) => {
	const [metrics, setMetrics] = useState<IMetrics>({
		hostname: connection.name,
		type: "",
		cpu: "",
		ram: "",
		disk: "",
	});
	const [status, setStatus] = useState<IStatus>("idle");
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [client, setClient] = useState<Client | null>(null);

	useEffect(() => {
		const sshClient = new Client();
		let interval: NodeJS.Timeout | null = null;

		setStatus("connecting");
		setErrorMsg(null);

		const fetchMetrics = () => {
			if (!sshClient) {
				return;
			}

			const cmd = `
				hostname;
				top -bn1 | grep "Cpu(s)" | awk '{print $2+$4}' ;
				free -m | awk 'NR==2{print $3 "/" $2}' ;
				df -h / | awk 'NR==2{print $3 "/" $2}'
			`;

			sshClient.exec(cmd, (err, stream) => {
				if (err) {
					return;
				}

				let output = "";
				stream.on("data", (chunk: Buffer) => {
					output += chunk.toString();
				});

				stream.on("close", () => {
					const lines = output
						.split("\n")
						.map((l) => l.trim())
						.filter(Boolean);
					setMetrics({
						hostname: connection.name,
						type: lines[0] ?? "",
						cpu: lines[1] ? lines[1] + "%" : "",
						ram: lines[2] ? lines[2] + "MB" : "",
						disk: lines[3] ?? "",
					});
				});
			});
		};

		sshClient
			.on("ready", () => {
				setStatus("success");
				setClient(sshClient);

				fetchMetrics();
				interval = setInterval(fetchMetrics, intervalMs);
			})
			.on("error", (err) => {
				setStatus("error");
				setErrorMsg(err.message);
			})
			.connect({
				host: connection.host,
				port: connection.port || 22,
				username: connection.user,
				password: connection.password,
				privateKey: connection.privateKey
					? fs.readFileSync(connection.privateKey)
					: undefined,
				readyTimeout: 10000,
			});

		return () => {
			if (interval) {
				clearInterval(interval);
			}
			sshClient.end();
			setClient(null);
		};
	}, [connection, intervalMs]);

	return { metrics, status, errorMsg, client };
};
