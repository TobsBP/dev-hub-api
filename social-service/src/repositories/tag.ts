import { db } from '@/lib/db.js';
import type { NewTag, PostTag, Tag } from '@/types/tag.js';

export const tagRepository = {
	async findAll(): Promise<Tag[]> {
		return db<Tag[]>`SELECT * FROM tags ORDER BY name ASC`;
	},

	async findById(id: string): Promise<Tag | null> {
		const [tag] = await db<Tag[]>`SELECT * FROM tags WHERE id = ${id}`;
		return tag ?? null;
	},

	async findByPostId(postId: string): Promise<Tag[]> {
		return db<Tag[]>`
      SELECT t.* FROM tags t
      INNER JOIN post_tags pt ON pt.tag_id = t.id
      WHERE pt.post_id = ${postId}
    `;
	},

	async create(data: NewTag): Promise<Tag> {
		const [tag] = await db<Tag[]>`
      INSERT INTO tags ${db(data)}
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING *
    `;
		return tag;
	},

	async delete(id: string): Promise<void> {
		await db`DELETE FROM tags WHERE id = ${id}`;
	},

	async addToPost(data: PostTag): Promise<void> {
		await db`INSERT INTO post_tags ${db(data)} ON CONFLICT DO NOTHING`;
	},

	async removeFromPost(postId: string, tagId: string): Promise<void> {
		await db`DELETE FROM post_tags WHERE post_id = ${postId} AND tag_id = ${tagId}`;
	},
};
