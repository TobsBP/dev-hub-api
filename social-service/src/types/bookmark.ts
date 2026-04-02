import { z } from 'zod';

export const bookmarkSchema = z.object({
	user_id: z.uuid(),
	post_id: z.uuid(),
	created_at: z.string(),
});

export const getBookmarksSchema = {
	description: 'Get all bookmarks',
	response: {
		200: z.array(bookmarkSchema),
	},
};

export type Bookmark = z.infer<typeof bookmarkSchema>;
export type NewBookmark = Omit<Bookmark, 'created_at'>;
