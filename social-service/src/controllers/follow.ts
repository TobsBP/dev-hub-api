import type { FastifyReply, FastifyRequest } from 'fastify';
import { followService } from '@/services/follow.js';
import type { NewFollow } from '@/types/follow.js';

export const followController = {
	async getFollowers(
		request: FastifyRequest<{ Params: { user_id: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await followService.getFollowers(
			request.params.user_id,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getFollowing(
		request: FastifyRequest<{ Params: { user_id: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await followService.getFollowing(
			request.params.user_id,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async follow(
		request: FastifyRequest<{ Body: NewFollow }>,
		reply: FastifyReply,
	) {
		const { error } = await followService.follow(request.body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Followed successfully' });
	},

	async unfollow(
		request: FastifyRequest<{
			Params: { follower_id: string; following_id: string };
		}>,
		reply: FastifyReply,
	) {
		const { follower_id, following_id } = request.params;
		const { data, error } = await followService.unfollow(follower_id, following_id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Follow not found' });
		return reply.status(200).send({ message: 'Unfollowed successfully' });
	},
};
