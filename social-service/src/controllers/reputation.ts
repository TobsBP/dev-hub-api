import type { FastifyReply, FastifyRequest } from 'fastify';
import { reputationService } from '@/services/reputation.js';
import type { NewReputation } from '@/types/reputation.js';

export const reputationController = {
	async getByUser(
		request: FastifyRequest<{ Params: { user_id: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await reputationService.getReputationByUser(
			request.params.user_id,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async add(
		request: FastifyRequest<{ Body: NewReputation }>,
		reply: FastifyReply,
	) {
		const { error } = await reputationService.addReputation(request.body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Reputation added' });
	},
};
