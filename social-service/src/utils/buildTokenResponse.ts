import type { FastifyRequest } from 'fastify';
import { EXPIRES_IN, EXPIRES_IN_MS } from '@/utils/consts/auth.js';

export function buildTokenResponse(
	server: FastifyRequest['server'],
	user: { id: string; email: string; role: string | null },
) {
	const expireAt = new Date(Date.now() + EXPIRES_IN_MS).toISOString();
	const token = server.jwt.sign(
		{ sub: user.id, email: user.email, role: user.role },
		{ expiresIn: EXPIRES_IN },
	);
	return { token, expireAt };
}
