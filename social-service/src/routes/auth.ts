import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authController } from '@/controllers/auth.js';

export const authRoutes = async (app: FastifyInstance) => {
	app.post(
		'/auth/login',
		{
			schema: {
				tags: ['Auth'],
				description: 'Authenticate user and return JWT token',
				body: z.object({
					email: z.email(),
					password: z.string(),
				}),
				response: {
					200: z.object({
						token: z.string(),
						expireAt: z.string(),
					}),
				},
			},
		},
		authController.login,
	);

	app.post(
		'/auth/register',
		{
			schema: {
				tags: ['Auth'],
				description:
					'Register a new user\n\n**Fields (multipart/form-data):**\n- `username` (string, max 50) — required\n- `email` (string, max 100) — required\n- `password` (string) — required\n- `bio` (string) — optional\n- `avatar` (file) — optional',
				consumes: ['multipart/form-data'],
				response: {
					201: z.object({
						token: z.string(),
						expireAt: z.string(),
					}),
				},
			},
		},
		authController.register,
	);
};
