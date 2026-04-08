import type { Readable } from 'node:stream';
import { z } from 'zod';

export const postSchema = z.object({
	id: z.string(),
	user_id: z.uuid(),
	content: z.string().min(5),
	type: z.string(),
	image_url: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string().nullable(),
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

export type NewPostInput = Omit<NewPost, 'image_url'> & {
	imageStream?: Readable;
};
