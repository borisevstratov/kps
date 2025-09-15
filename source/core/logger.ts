import fs from "node:fs";
import path from "node:path";

const LOG_FILE = path.resolve(process.cwd(), "kps.log");

export function logger(...args: unknown[]) {
	const timestamp = new Date().toISOString();

	const formattedArgs = args
		.map((arg) => {
			if (typeof arg === "string") return arg;
			try {
				return JSON.stringify(arg, null, 2);
			} catch {
				return String(arg);
			}
		})
		.join(" ");

	const logLine = `[${timestamp}] ${formattedArgs}\n`;
	fs.appendFileSync(LOG_FILE, logLine, "utf8");
}
