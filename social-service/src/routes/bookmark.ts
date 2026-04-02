import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { bookmarkController } from '@/controllers/bookmark.js';
import { bookmarkSchema } from '@/types/bookmark.js';

export const bookmarkRoutes = async (app: FastifyInstance) => {
	app.get(
		'/users/:userId/bookmarks',
		{
			schema: {
				tags: ['Bookmarks'],
				description: 'Get bookmarks of a user',
				params: z.object({ userId: z.uuid() }),
				response: { 200: z.array(bookmarkSchema) },
			},
		},
		bookmarkController.getByUser,
	);

	app.post(
		'/bookmarks',
		{
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
		'/bookmark/:userId/:postId',
		{
			schema: {
				tags: ['Bookmarks'],
				description: 'Remove a bookmark',
				params: z.object({ userId: z.uuid(), postId: z.uuid() }),
			},
		},
		bookmarkController.delete,
	);
};
