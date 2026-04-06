import type { FastifyReply, FastifyRequest } from 'fastify';
import { followService } from '@/services/follow.js';
import type { NewFollow } from '@/types/follow.js';

export const followController = {
	async getFollowers(
		request: FastifyRequest<{ Params: { userId: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await followService.getFollowers(
			request.params.userId,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getFollowing(
		request: FastifyRequest<{ Params: { userId: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await followService.getFollowing(
			request.params.userId,
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
			Params: { followerId: string; followingId: string };
		}>,
		reply: FastifyReply,
	) {
		const { followerId, followingId } = request.params;
		const { error } = await followService.unfollow(followerId, followingId);
		if (error) return reply.status(500).send({ error });
		return reply.status(204).send();
	},
};
