import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { postSolutionController } from '@/controllers/postSolution.js';
import {
	getPostSolutionsSchema,
	postSolutionSchema,
} from '@/types/postSolution.js';

export const postSolutionRoutes = async (app: FastifyInstance) => {
	app.get(
		'/posts/:postId/solution',
		{
			schema: {
				...getPostSolutionsSchema,
				tags: ['Post Solutions'],
				description: 'Get solution for a post',
				params: z.object({ postId: z.uuid() }),
				response: { 200: postSolutionSchema },
			},
		},
		postSolutionController.getByPost,
	);

	app.put(
		'/posts/:postId/solution',
		{
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
		'/posts/:postId/solution',
		{
			schema: {
				tags: ['Post Solutions'],
				description: 'Remove solution from a post',
				params: z.object({ postId: z.uuid() }),
			},
		},
		postSolutionController.remove,
	);
};
