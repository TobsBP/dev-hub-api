import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { userController } from '@/controllers/user.js';
import { getUsersSchema, userSchema } from '@/types/user.js';
import { authenticate } from '@/utils/authenticate.js';

const safeUserSchema = userSchema.omit({ password_hash: true });

export const userRoutes = async (app: FastifyInstance) => {
	app.get(
		'/users',
		{ schema: { ...getUsersSchema, tags: ['Users'] } },
		userController.getAll,
	);

	app.get(
		'/user/:id',
		{
			schema: {
				tags: ['Users'],
				description: 'Get user by id',
				params: z.object({ id: z.uuid() }),
				response: { 200: safeUserSchema },
			},
		},
		userController.getById,
	);

	app.post(
		'/user',
		{
			schema: {
				tags: ['Users'],
				description:
					'Create a user\n\n**Fields (multipart/form-data):**\n- `username` (string, max 50) — required\n- `email` (string, max 100) — required\n- `password` (string) — required\n- `bio` (string) — optional\n- `avatar` (file) — optional',
				consumes: ['multipart/form-data'],
				response: { 201: z.object({ message: z.string() }) },
			},
		},
		userController.create,
	);

	app.patch(
		'/user/:id',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Users'],
				description:
					'Update a user\n\n**Fields (multipart/form-data):**\n- `username` (string, max 50) — optional\n- `email` (string, max 100) — optional\n- `bio` (string) — optional\n- `avatar` (file) — optional',
				consumes: ['multipart/form-data'],
				params: z.object({ id: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
		},
		userController.update,
	);

	app.delete(
		'/user/:id',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Users'],
				description: 'Delete a user',
				params: z.object({ id: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
		},
		userController.delete,
	);
};
