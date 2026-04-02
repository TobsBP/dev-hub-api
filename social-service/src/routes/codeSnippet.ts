import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { codeSnippetController } from '@/controllers/codeSnippet.js';
import {
	codeSnippetSchema,
	getCodeSnippetsSchema,
} from '@/types/codeSnippet.js';

export const codeSnippetRoutes = async (app: FastifyInstance) => {
	app.get(
		'/snippets/:postId',
		{
			schema: {
				...getCodeSnippetsSchema,
				tags: ['Code Snippets'],
				description: 'Get code snippets by post',
				params: z.object({ postId: z.uuid() }),
			},
		},
		codeSnippetController.getByPost,
	);

	app.get(
		'/snippet/:id',
		{
			schema: {
				tags: ['Code Snippets'],
				description: 'Get code snippet by id',
				params: z.object({ id: z.uuid() }),
				response: { 200: codeSnippetSchema },
			},
		},
		codeSnippetController.getById,
	);

	app.post(
		'/snippets',
		{
			schema: {
				tags: ['Code Snippets'],
				description: 'Create a code snippet',
				body: codeSnippetSchema.omit({ id: true }),
				response: { 201: codeSnippetSchema },
			},
		},
		codeSnippetController.create,
	);

	app.patch(
		'/snippet/:id',
		{
			schema: {
				tags: ['Code Snippets'],
				description: 'Update a code snippet',
				params: z.object({ id: z.uuid() }),
				body: codeSnippetSchema.omit({ id: true, post_id: true }).partial(),
				response: { 200: codeSnippetSchema },
			},
		},
		codeSnippetController.update,
	);

	app.delete(
		'/snippet/:id',
		{
			schema: {
				tags: ['Code Snippets'],
				description: 'Delete a code snippet',
				params: z.object({ id: z.uuid() }),
			},
		},
		codeSnippetController.delete,
	);
};
