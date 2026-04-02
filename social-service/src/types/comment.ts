import { z } from 'zod';

export const commentSchema = z.object({
	id: z.uuid(),
	post_id: z.uuid(),
	user_id: z.uuid(),
	parent_id: z.uuid().nullable(),
	content: z.string().min(1),
	created_at: z.string(),
});

export const getCommentsSchema = {
	description: 'Get all comments',
	response: {
		200: z.array(commentSchema),
	},
};

export type Comment = z.infer<typeof commentSchema>;
export type NewComment = Omit<Comment, 'id' | 'created_at'>;
export type CommentUpdate = Partial<Pick<NewComment, 'content'>>;
