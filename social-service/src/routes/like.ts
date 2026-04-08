import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { likeController } from '@/controllers/like.js';
import { likeSchema } from '@/types/like.js';
import { authenticate } from '@/utils/authenticate.js';

export const likeRoutes = async (app: FastifyInstance) => {
	app.get(
		'/likes/:target_type/:target_id',
		{
			schema: {
				tags: ['Likes'],
				description: 'Get likes by target',
				params: z.object({
					target_type: z.enum(['post', 'comment']),
					target_id: z.uuid(),
				}),
				response: { 200: z.array(likeSchema) },
			},
		},
		likeController.getByTarget,
	);

	app.post(
		'/likes',
		{
			preHandler: [authenticate],
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
		'/like/:user_id/:target_type/:target_id',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Likes'],
				description: 'Unlike a post or comment',
				params: z.object({
					user_id: z.uuid(),
					target_type: z.enum(['post', 'comment']),
					target_id: z.uuid(),
				}),
				response: { 200: z.object({ message: z.string() }) },
			},
		},
		likeController.delete,
	);
};
