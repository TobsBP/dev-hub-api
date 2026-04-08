import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { commentController } from '@/controllers/comment.js';
import { commentSchema, getCommentsSchema } from '@/types/comment.js';
import { authenticate } from '@/utils/authenticate.js';

export const commentRoutes = async (app: FastifyInstance) => {
	app.get(
		'/comments/:post_id',
		{
			schema: {
				...getCommentsSchema,
				tags: ['Comments'],
				description: 'Get comments by post',
				params: z.object({ post_id: z.uuid() }),
			},
		},
		commentController.getByPost,
	);

	app.get(
		'/comment/:id',
		{
			schema: {
				tags: ['Comments'],
				description: 'Get comment by id',
				params: z.object({ id: z.uuid() }),
				response: { 200: commentSchema },
			},
		},
		commentController.getById,
	);

	app.post(
		'/comments',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Comments'],
				description: 'Create a comment',
				body: commentSchema.omit({ id: true, created_at: true }),
				response: { 201: z.object({ message: z.string() }) },
			},
		},
		commentController.create,
	);

	app.patch(
		'/comment/:id',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Comments'],
				description: 'Update a comment',
				params: z.object({ id: z.uuid() }),
				body: z.object({ content: z.string().min(1) }),
				response: { 200: commentSchema },
			},
		},
		commentController.update,
	);

	app.delete(
		'/comment/:id',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Comments'],
				description: 'Delete a comment',
				params: z.object({ id: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
		},
		commentController.delete,
	);
};
