export const formatBytes = (bytes: number): string => {
	if (bytes === 0) {
		return "0B";
	}
	const units = ["B", "K", "M", "G", "T"];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	const value = bytes / 1024 ** i;
	return `${value.toFixed(1)}${units[i]}`;
};
