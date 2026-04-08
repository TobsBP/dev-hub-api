import type { FastifyReply, FastifyRequest } from 'fastify';
import { likeService } from '@/services/like.js';
import type { NewLike } from '@/types/like.js';

export const likeController = {
	async getByTarget(request: FastifyRequest, reply: FastifyReply) {
		const { target_type, target_id } = request.params as {
			target_type: string;
			target_id: string;
		};
		const { data, error } = await likeService.getLikesByTarget(
			target_type,
			target_id,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async create(request: FastifyRequest, reply: FastifyReply) {
		const body = request.body as NewLike;
		const { error } = await likeService.createLike(body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Like created' });
	},

	async delete(request: FastifyRequest, reply: FastifyReply) {
		const { user_id, target_type, target_id } = request.params as {
			user_id: string;
			target_type: string;
			target_id: string;
		};
		const { data, error } = await likeService.deleteLike(
			user_id,
			target_type,
			target_id,
		);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Like not found' });
		return reply.status(200).send({ message: 'Like removed' });
	},
};
