import type { FastifyReply, FastifyRequest } from 'fastify';
import { reputationService } from '@/services/reputation.js';
import type { NewReputation } from '@/types/reputation.js';

export const reputationController = {
	async getByUser(request: FastifyRequest, reply: FastifyReply) {
		const { user_id } = request.params as { user_id: string };
		const { data, error } =
			await reputationService.getReputationByUser(user_id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async add(request: FastifyRequest, reply: FastifyReply) {
		const body = request.body as NewReputation;
		const { error } = await reputationService.addReputation(body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Reputation added' });
	},
};
