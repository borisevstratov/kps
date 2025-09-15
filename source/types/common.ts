export type IMetrics = {
	hostname?: string;
	cpu?: string;
	ram?: string;
	disk?: string;
	type?: string;
};

export type IStatus = "idle" | "connecting" | "success" | "error";

export type IExplorerTab = "info" | "file" | "terminal";
