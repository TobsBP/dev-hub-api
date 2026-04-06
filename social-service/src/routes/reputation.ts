import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { reputationController } from '@/controllers/reputation.js';
import { getReputationSchema, reputationSchema } from '@/types/reputation.js';

export const reputationRoutes = async (app: FastifyInstance) => {
	app.get(
		'/reputations/:user_id',
		{
			schema: {
				...getReputationSchema,
				tags: ['Reputation'],
				description: 'Get reputation history of a user',
				params: z.object({ user_id: z.uuid() }),
			},
		},
		reputationController.getByUser,
	);

	app.post(
		'/reputation',
		{
			schema: {
				tags: ['Reputation'],
				description: 'Add a reputation entry',
				body: reputationSchema.omit({ id: true, created_at: true }),
				response: { 201: reputationSchema },
			},
		},
		reputationController.add,
	);
};
