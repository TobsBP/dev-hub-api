import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { postController } from '@/controllers/post.js';
import { getPostsSchema, postSchema } from '@/types/post.js';
import { authenticate } from '@/utils/authenticate.js';

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
		'/posts/:user_id',
		{
			schema: {
				tags: ['Posts'],
				description: 'Get posts by user',
				params: z.object({ user_id: z.uuid() }),
				response: { 200: z.array(postSchema) },
			},
		},
		postController.getByUser,
	);

	app.post(
		'/post',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Posts'],
				description:
					'Create a post\n\n**Fields (multipart/form-data):**\n- `user_id` (uuid) — required\n- `content` (string, min 5) — required\n- `type` (string) — required\n- `image` (file) — optional',
				consumes: ['multipart/form-data'],
				response: { 201: z.object({ message: z.string() }) },
			},
		},
		postController.create,
	);

	app.patch(
		'/post/:id',
		{
			preHandler: [authenticate],
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
			preHandler: [authenticate],
			schema: {
				tags: ['Posts'],
				description: 'Delete a post',
				params: z.object({ id: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
		},
		postController.delete,
	);
};
