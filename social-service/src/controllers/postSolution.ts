import type { FastifyReply, FastifyRequest } from 'fastify';
import type { z } from 'zod';
import { postSolutionService } from '@/services/postSolution.js';
import type { postSolutionSchema } from '@/types/postSolution.js';

type PostSolution = z.infer<typeof postSolutionSchema>;

export const postSolutionController = {
	async getByPost(request: FastifyRequest, reply: FastifyReply) {
		const { post_id } = request.params as { post_id: string };
		const { data, error } =
			await postSolutionService.getSolutionByPost(post_id);
		if (error) return reply.status(500).send({ error });
		if (!data)
			return reply.status(404).send({ error: 'No solution set for this post' });
		return reply.status(200).send(data);
	},

	async set(request: FastifyRequest, reply: FastifyReply) {
		const body = request.body as PostSolution;
		const { error } = await postSolutionService.setSolution(body);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send({ message: 'Solution set' });
	},

	async remove(request: FastifyRequest, reply: FastifyReply) {
		const { post_id } = request.params as { post_id: string };
		const { data, error } = await postSolutionService.removeSolution(post_id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Solution not found' });
		return reply.status(200).send({ message: 'Solution removed' });
	},
};
