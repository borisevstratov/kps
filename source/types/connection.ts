export interface IConnection {
	name: string;
	host: string;
	port?: number;
	user: string;
	password?: string;
	privateKey?: string;
}
