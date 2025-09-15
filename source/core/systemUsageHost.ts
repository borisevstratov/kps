import { exec } from "node:child_process";
import os from "node:os";
import { promisify } from "node:util";
import { formatBytes } from "./ops.js";

const execAsync = promisify(exec);

export const getCpuUsage = async (): Promise<string> => {
	const startCpus = os.cpus();

	await new Promise((res) => setTimeout(res, 1000));

	const endCpus = os.cpus();
	let totalIdle = 0;
	let totalTick = 0;

	endCpus.forEach((cpu, i) => {
		const startCpu = startCpus[i];
		if (!startCpu) {
			return;
		}

		const idleDiff = cpu.times.idle - startCpu.times.idle;
		const totalDiff =
			cpu.times.user -
			startCpu.times.user +
			(cpu.times.nice - startCpu.times.nice) +
			(cpu.times.sys - startCpu.times.sys) +
			(cpu.times.idle - startCpu.times.idle) +
			(cpu.times.irq - startCpu.times.irq);

		totalIdle += idleDiff;
		totalTick += totalDiff;
	});

	if (totalTick === 0) {
		return "N/A";
	}
	return `${((1 - totalIdle / totalTick) * 100).toFixed(1)}%`;
};

export const getRamUsage = (): string => {
	const ramTotal = os.totalmem();
	const ramFree = os.freemem();
	const ram = `${formatBytes(ramFree)}/${formatBytes(ramTotal)}`;

	return ram;
};

export const getDiskUsage = async (): Promise<string> => {
	try {
		if (os.platform() === "win32") {
			// Get sizes in bytes
			const { stdout } = await execAsync(
				`wmic logicaldisk where "DeviceID='C:'" get Size,FreeSpace /format:list`,
			);
			const lines = stdout.trim().split("\n");
			const freeLine = lines[0]?.split("=")[1];
			const totalLine = lines[1]?.split("=")[1];

			const free = freeLine ? parseInt(freeLine) : NaN;
			const total = totalLine ? parseInt(totalLine) : NaN;

			if (!total || Number.isNaN(free)) return "N/A";

			const used = total - free;
			return `${formatBytes(used)}/${formatBytes(total)}`;
		} else {
			// Unix-like: use `df -h` for human-readable sizes
			const { stdout } = await execAsync("df -h /");
			const lines = stdout.trim().split("\n");
			const usageLine = lines.at(-1) ?? "";
			// Format: Filesystem Size Used Avail Use% Mounted
			const parts = usageLine.split(/\s+/);
			const total = parts[1];
			const used = parts[2];
			return total && used ? `${used}/${total}` : "N/A";
		}
	} catch {
		return "N/A";
	}
};
