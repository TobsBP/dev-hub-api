import type { FastifyReply, FastifyRequest } from 'fastify';
import type { z } from 'zod';
import { postSolutionService } from '@/services/postSolution.js';
import type { postSolutionSchema } from '@/types/postSolution.js';

type PostSolution = z.infer<typeof postSolutionSchema>;

export const postSolutionController = {
	async getByPost(
		request: FastifyRequest<{ Params: { post_id: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await postSolutionService.getSolutionByPost(
			request.params.post_id,
		);
		if (error) return reply.status(500).send({ error });
		if (!data)
			return reply.status(404).send({ error: 'No solution set for this post' });
		return reply.status(200).send(data);
	},

	async set(
		request: FastifyRequest<{ Body: PostSolution }>,
		reply: FastifyReply,
	) {
		const { error } = await postSolutionService.setSolution(request.body);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send({ message: 'Solution set' });
	},

	async remove(
		request: FastifyRequest<{ Params: { post_id: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await postSolutionService.removeSolution(
			request.params.post_id,
		);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Solution not found' });
		return reply.status(200).send({ message: 'Solution removed' });
	},
};
