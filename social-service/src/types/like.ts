import { z } from 'zod';

export const likeSchema = z.object({
	id: z.uuid(),
	user_id: z.uuid(),
	target_type: z.enum(['post', 'comment']),
	target_id: z.uuid(),
	created_at: z.string(),
});

export const getLikesSchema = {
	description: 'Get all likes',
	response: {
		200: z.array(likeSchema),
	},
};

export type Like = z.infer<typeof likeSchema>;
export type NewLike = Omit<Like, 'id' | 'created_at'>;
