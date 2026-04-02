import { z } from 'zod';

export const tagSchema = z.object({
	id: z.uuid(),
	name: z.string().max(50),
});

export const postTagSchema = z.object({
	post_id: z.uuid(),
	tag_id: z.uuid(),
});

export const getTagsSchema = {
	description: 'Get all tags',
	response: {
		200: z.array(tagSchema),
	},
};

export type Tag = z.infer<typeof tagSchema>;
export type NewTag = Omit<Tag, 'id'>;
export type PostTag = z.infer<typeof postTagSchema>;
