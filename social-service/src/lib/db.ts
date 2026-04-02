import postgres from 'postgres';

if (!process.env.DB_URL) {
	throw new Error('DB_URL is not defined in .env');
}

export const db = postgres(process.env.DB_URL);
