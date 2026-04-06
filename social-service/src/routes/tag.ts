import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { tagController } from '@/controllers/tag.js';
import { getTagsSchema, tagSchema } from '@/types/tag.js';

export const tagRoutes = async (app: FastifyInstance) => {
	app.get(
		'/tags',
		{ schema: { ...getTagsSchema, tags: ['Tags'] } },
		tagController.getAll,
	);

	app.get(
		'/tag/:id',
		{
			schema: {
				tags: ['Tags'],
				description: 'Get tag by id',
				params: z.object({ id: z.uuid() }),
				response: { 200: tagSchema },
			},
		},
		tagController.getById,
	);

	app.get(
		'/tags/:post_id',
		{
			schema: {
				tags: ['Tags'],
				description: 'Get tags of a post',
				params: z.object({ post_id: z.uuid() }),
				response: { 200: z.array(tagSchema) },
			},
		},
		tagController.getByPost,
	);

	app.post(
		'/tags',
		{
			schema: {
				tags: ['Tags'],
				description: 'Create a tag',
				body: tagSchema.omit({ id: true }),
				response: { 201: z.object({ message: z.string() }) },
			},
		},
		tagController.create,
	);

	app.delete(
		'/tag/:id',
		{
			schema: {
				tags: ['Tags'],
				description: 'Delete a tag',
				params: z.object({ id: z.uuid() }),
			},
		},
		tagController.delete,
	);

	app.post(
		'/tag/:post_id/:tag_id',
		{
			schema: {
				tags: ['Tags'],
				description: 'Add a tag to a post',
				params: z.object({ post_id: z.uuid(), tag_id: z.uuid() }),
			},
		},
		tagController.addToPost,
	);

	app.delete(
		'/tag/:postId/:tagId',
		{
			schema: {
				tags: ['Tags'],
				description: 'Remove a tag from a post',
				params: z.object({ post_id: z.uuid(), tag_id: z.uuid() }),
			},
		},
		tagController.removeFromPost,
	);
};
