import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { postController } from '@/controllers/post.js';
import { getPostsSchema, postSchema } from '@/types/post.js';

export const postRoutes = async (app: FastifyInstance) => {
	app.get(
		'/posts',
		{ schema: { ...getPostsSchema, tags: ['Posts'] } },
		postController.getAll,
	);

	app.get(
		'/post/:id',
		{
			schema: {
				tags: ['Posts'],
				description: 'Get post by id',
				params: z.object({ id: z.uuid() }),
				response: { 200: postSchema },
			},
		},
		postController.getById,
	);

	app.get(
		'/posts/:userId',
		{
			schema: {
				tags: ['Posts'],
				description: 'Get posts by user',
				params: z.object({ userId: z.uuid() }),
				response: { 200: z.array(postSchema) },
			},
		},
		postController.getByUser,
	);

	app.post(
		'/post',
		{
			schema: {
				tags: ['Posts'],
				description: 'Create a post',
				body: postSchema.omit({ id: true, created_at: true, updated_at: true }),
				response: { 201: postSchema },
			},
		},
		postController.create,
	);

	app.patch(
		'/post/:id',
		{
			schema: {
				tags: ['Posts'],
				description: 'Update a post',
				params: z.object({ id: z.uuid() }),
				body: postSchema
					.omit({ id: true, created_at: true, updated_at: true })
					.partial(),
				response: { 200: postSchema },
			},
		},
		postController.update,
	);

	app.delete(
		'/post/:id',
		{
			schema: {
				tags: ['Posts'],
				description: 'Delete a post',
				params: z.object({ id: z.uuid() }),
			},
		},
		postController.delete,
	);
};
