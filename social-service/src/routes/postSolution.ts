import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { postSolutionController } from '@/controllers/postSolution.js';
import {
	getPostSolutionsSchema,
	postSolutionSchema,
} from '@/types/postSolution.js';
import { authenticate } from '@/utils/authenticate.js';

export const postSolutionRoutes = async (app: FastifyInstance) => {
	app.get(
		'/posts/:post_id/solution',
		{
			schema: {
				...getPostSolutionsSchema,
				tags: ['Post Solutions'],
				description: 'Get solution for a post',
				params: z.object({ post_id: z.uuid() }),
				response: { 200: postSolutionSchema },
			},
		},
		postSolutionController.getByPost,
	);

	app.put(
		'/posts/:post_id/solution',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Post Solutions'],
				description: 'Set solution for a post',
				body: postSolutionSchema,
				response: { 200: postSolutionSchema },
			},
		},
		postSolutionController.set,
	);

	app.delete(
		'/posts/:post_id/solution',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Post Solutions'],
				description: 'Remove solution from a post',
				params: z.object({ post_id: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
		},
		postSolutionController.remove,
	);
};
