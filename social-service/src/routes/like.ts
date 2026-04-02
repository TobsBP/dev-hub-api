import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { likeController } from '@/controllers/like.js';
import { likeSchema } from '@/types/like.js';

export const likeRoutes = async (app: FastifyInstance) => {
	app.get(
		'/likes/:targetType/:targetId',
		{
			schema: {
				tags: ['Likes'],
				description: 'Get likes by target',
				params: z.object({
					targetType: z.enum(['post', 'comment']),
					targetId: z.uuid(),
				}),
				response: { 200: z.array(likeSchema) },
			},
		},
		likeController.getByTarget,
	);

	app.post(
		'/likes',
		{
			schema: {
				tags: ['Likes'],
				description: 'Like a post or comment',
				body: likeSchema.omit({ id: true, created_at: true }),
				response: { 201: likeSchema },
			},
		},
		likeController.create,
	);

	app.delete(
		'/like/:userId/:targetType/:targetId',
		{
			schema: {
				tags: ['Likes'],
				description: 'Unlike a post or comment',
				params: z.object({
					userId: z.uuid(),
					targetType: z.enum(['post', 'comment']),
					targetId: z.uuid(),
				}),
			},
		},
		likeController.delete,
	);
};
