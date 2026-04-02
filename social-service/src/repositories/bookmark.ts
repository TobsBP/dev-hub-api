import { db } from '@/lib/db.js';
import type { Bookmark, NewBookmark } from '@/types/bookmark.js';

export const bookmarkRepository = {
	async findByUserId(userId: string): Promise<Bookmark[]> {
		return db<Bookmark[]>`
      SELECT * FROM bookmarks WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
	},

	async create(data: NewBookmark): Promise<Bookmark> {
		const [bookmark] = await db<Bookmark[]>`
      INSERT INTO bookmarks ${db(data)}
      RETURNING *
    `;
		return bookmark;
	},

	async delete(userId: string, postId: string): Promise<void> {
		await db`DELETE FROM bookmarks WHERE user_id = ${userId} AND post_id = ${postId}`;
	},
};
