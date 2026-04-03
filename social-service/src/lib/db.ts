import postgres from 'postgres';

if (!process.env.DB_URL) {
	throw new Error('DB_URL is not defined in .env');
}

export const db = postgres(process.env.DB_URL, {
	types: {
		timestamp: { to: 1114, from: [1114, 1184], parse: (v: string) => v, serialize: (v: string) => v },
	},
});
