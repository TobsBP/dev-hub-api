import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { followController } from '@/controllers/follow.js';
import { followSchema } from '@/types/follow.js';

export const followRoutes = async (app: FastifyInstance) => {
	app.get(
		'/users/:userId/followers',
		{
			schema: {
				tags: ['Follows'],
				description: 'Get followers of a user',
				params: z.object({ userId: z.uuid() }),
				response: { 200: z.array(followSchema) },
			},
		},
		followController.getFollowers,
	);

	app.get(
		'/users/:userId/following',
		{
			schema: {
				tags: ['Follows'],
				description: 'Get users a user is following',
				params: z.object({ userId: z.uuid() }),
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
		'/follow/:followerId/:followingId',
		{
			schema: {
				tags: ['Follows'],
				description: 'Unfollow a user',
				params: z.object({ followerId: z.uuid(), followingId: z.uuid() }),
			},
		},
		followController.unfollow,
	);
};
