import type { FastifyReply, FastifyRequest } from 'fastify';
import { likeService } from '@/services/like.js';
import type { NewLike } from '@/types/like.js';

export const likeController = {
	async getByTarget(
		request: FastifyRequest<{
			Params: { targetType: string; targetId: string };
		}>,
		reply: FastifyReply,
	) {
		const { targetType, targetId } = request.params;
		const { data, error } = await likeService.getLikesByTarget(
			targetType,
			targetId,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async create(
		request: FastifyRequest<{ Body: NewLike }>,
		reply: FastifyReply,
	) {
		const { data, error } = await likeService.createLike(request.body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send(data);
	},

	async delete(
		request: FastifyRequest<{
			Params: { userId: string; targetType: string; targetId: string };
		}>,
		reply: FastifyReply,
	) {
		const { userId, targetType, targetId } = request.params;
		const { error } = await likeService.deleteLike(
			userId,
			targetType,
			targetId,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(204).send();
	},
};
