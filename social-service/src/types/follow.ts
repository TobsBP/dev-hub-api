import { z } from 'zod';

export const followSchema = z.object({
	follower_id: z.uuid(),
	following_id: z.uuid(),
	created_at: z.string(),
});

export const getFollowsSchema = {
	description: 'Get all follows',
	response: {
		200: z.array(followSchema),
	},
};

export type Follow = z.infer<typeof followSchema>;
export type NewFollow = Omit<Follow, 'created_at'>;
