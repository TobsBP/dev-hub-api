import { z } from 'zod';

export const reputationSchema = z.object({
	id: z.uuid(),
	user_id: z.uuid(),
	points: z.number().int(),
	reason: z.string().max(50).nullable(),
	created_at: z.string(),
});

export const getReputationSchema = {
	description: 'Get all reputation entries',
	response: {
		200: z.array(reputationSchema),
	},
};

export type Reputation = z.infer<typeof reputationSchema>;
export type NewReputation = Omit<Reputation, 'id' | 'created_at'>;
