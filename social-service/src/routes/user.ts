import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { userController } from '@/controllers/user.js';
import { getUsersSchema, userSchema } from '@/types/user.js';

const safeUserSchema = userSchema.omit({ password_hash: true });

export const userRoutes = async (app: FastifyInstance) => {
	app.get('/users', { schema: { ...getUsersSchema, tags: ['Users'] } }, userController.getAll);

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
		'/users',
		{
			schema: {
				tags: ['Users'],
				description: 'Create a user',
				body: userSchema.omit({ id: true, created_at: true }),
				response: { 201: safeUserSchema },
			},
		},
		userController.create,
	);

	app.patch(
		'/user/:id',
		{
			schema: {
				tags: ['Users'],
				description: 'Update a user',
				params: z.object({ id: z.uuid() }),
				body: userSchema
					.omit({ id: true, created_at: true, password_hash: true })
					.partial(),
				response: { 200: safeUserSchema },
			},
		},
		userController.update,
	);

	app.delete(
		'/user/:id',
		{
			schema: {
				tags: ['Users'],
				description: 'Delete a user',
				params: z.object({ id: z.uuid() }),
			},
		},
		userController.delete,
	);
};
