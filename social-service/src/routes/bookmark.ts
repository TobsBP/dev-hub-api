import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { bookmarkController } from '@/controllers/bookmark.js';
import { bookmarkSchema } from '@/types/bookmark.js';
import { authenticate } from '@/utils/authenticate.js';

export const bookmarkRoutes = async (app: FastifyInstance) => {
	app.get(
		'/bookmarks/:user_id',
		{
			schema: {
				tags: ['Bookmarks'],
				description: 'Get bookmarks of a user',
				params: z.object({ user_id: z.uuid() }),
				response: { 200: z.array(bookmarkSchema) },
			},
		},
		bookmarkController.getByUser,
	);

	app.post(
		'/bookmarks',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Bookmarks'],
				description: 'Bookmark a post',
				body: bookmarkSchema.omit({ created_at: true }),
				response: { 201: bookmarkSchema },
			},
		},
		bookmarkController.create,
	);

	app.delete(
		'/bookmark/:user_id/:post_id',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['Bookmarks'],
				description: 'Remove a bookmark',
				params: z.object({ user_id: z.uuid(), post_id: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
		},
		bookmarkController.delete,
	);
};
