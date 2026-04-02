import { z } from 'zod';

export const postSchema = z.object({
	id: z.string(),
	user_id: z.uuid(),
	content: z.string().min(5),
	type: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

export const getPostsSchema = {
	description: 'Get all posts',
	response: {
		200: z.array(postSchema),
	},
};

export type Post = z.infer<typeof postSchema>;
export type NewPost = Omit<Post, 'id' | 'created_at' | 'updated_at'>;
export type PostUpdate = Partial<NewPost>;
