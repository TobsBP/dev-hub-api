import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { followController } from '@/controllers/follow.js';
import { followSchema } from '@/types/follow.js';

export const followRoutes = async (app: FastifyInstance) => {
	app.get(
		'/followers/:user_id',
		{
			schema: {
				tags: ['Follows'],
				description: 'Get followers of a user',
				params: z.object({ user_id: z.uuid() }),
				response: { 200: z.array(followSchema) },
			},
		},
		followController.getFollowers,
	);

	app.get(
		'/following/:user_id',
		{
			schema: {
				tags: ['Follows'],
				description: 'Get users a user is following',
				params: z.object({ user_id: z.uuid() }),
				response: { 200: z.array(followSchema) },
			},
		},
		followController.getFollowing,
	);

	app.post(
		'/follows',
		{
			schema: {
				tags: ['Follows'],
				description: 'Follow a user',
				body: followSchema.omit({ created_at: true }),
				response: { 201: followSchema },
			},
		},
		followController.follow,
	);

	app.delete(
		'/follow/:follower_id/:following_id',
		{
			schema: {
				tags: ['Follows'],
				description: 'Unfollow a user',
				params: z.object({ follower_id: z.uuid(), following_id: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
		},
		followController.unfollow,
	);
};
