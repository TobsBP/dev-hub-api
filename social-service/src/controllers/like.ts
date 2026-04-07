import type { FastifyReply, FastifyRequest } from 'fastify';
import { likeService } from '@/services/like.js';
import type { NewLike } from '@/types/like.js';

export const likeController = {
	async getByTarget(
		request: FastifyRequest<{
			Params: { target_type: string; target_id: string };
		}>,
		reply: FastifyReply,
	) {
		const { target_type, target_id } = request.params;
		const { data, error } = await likeService.getLikesByTarget(
			target_type,
			target_id,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async create(
		request: FastifyRequest<{ Body: NewLike }>,
		reply: FastifyReply,
	) {
		const { error } = await likeService.createLike(request.body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Like created' });
	},

	async delete(
		request: FastifyRequest<{
			Params: { user_id: string; target_type: string; target_id: string };
		}>,
		reply: FastifyReply,
	) {
		const { user_id, target_type, target_id } = request.params;
		const { error } = await likeService.deleteLike(
			user_id,
			target_type,
			target_id,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send({ message: 'Like removed' });
	},
};
