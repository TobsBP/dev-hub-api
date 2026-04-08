import type { FastifyReply, FastifyRequest } from 'fastify';
import { followService } from '@/services/follow.js';
import type { NewFollow } from '@/types/follow.js';

export const followController = {
	async getFollowers(request: FastifyRequest, reply: FastifyReply) {
		const { user_id } = request.params as { user_id: string };
		const { data, error } = await followService.getFollowers(user_id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getFollowing(request: FastifyRequest, reply: FastifyReply) {
		const { user_id } = request.params as { user_id: string };
		const { data, error } = await followService.getFollowing(user_id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async follow(request: FastifyRequest, reply: FastifyReply) {
		const body = request.body as NewFollow;
		const { error } = await followService.follow(body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Followed successfully' });
	},

	async unfollow(request: FastifyRequest, reply: FastifyReply) {
		const { follower_id, following_id } = request.params as {
			follower_id: string;
			following_id: string;
		};
		const { data, error } = await followService.unfollow(
			follower_id,
			following_id,
		);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Follow not found' });
		return reply.status(200).send({ message: 'Unfollowed successfully' });
	},
};
