import os from "node:os";
import { useEffect, useState } from "react";
import {
	getCpuUsage,
	getDiskUsage,
	getRamUsage,
} from "../core/systemUsageHost.js";
import type { IMetrics } from "../types/common.js";

const useSystemMetrics = (interval = 2_000): IMetrics => {
	const [metrics, setMetrics] = useState<IMetrics>({
		hostname: os.hostname(),
		type: os.type(),
		cpu: "Loading...",
		ram: "Loading...",
		disk: "Loading...",
	});

	useEffect(() => {
		let mounted = true;

		const updateMetrics = async () => {
			try {
				const [cpu, disk, ram] = await Promise.all([
					getCpuUsage(),
					getDiskUsage(),
					getRamUsage(),
				]);

				if (mounted) {
					setMetrics({
						hostname: os.hostname(),
						type: os.type(),
						cpu,
						ram,
						disk,
					});
				}
			} catch (err) {
				if (mounted) {
					setMetrics((prev) => ({
						...prev,
						cpu: "N/A",
						disk: "N/A",
					}));
				}
				console.error("Failed to fetch metrics:", err);
			}
		};

		updateMetrics();
		const timerId = setInterval(updateMetrics, interval);

		return () => {
			mounted = false;
			clearInterval(timerId);
		};
	}, [interval]);

	return metrics;
};

export default useSystemMetrics;
