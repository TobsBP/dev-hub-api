import { db } from '@/lib/db.js';
import type { NewPost, Post, PostUpdate } from '@/types/post.js';

export const postRepository = {
	async findAll(): Promise<Post[]> {
		return db<Post[]>`SELECT * FROM posts ORDER BY created_at DESC`;
	},

	async findById(id: string): Promise<Post | null> {
		const [post] = await db<Post[]>`SELECT * FROM posts WHERE id = ${id}`;
		return post ?? null;
	},

	async findByUserId(userId: string): Promise<Post[]> {
		return db<
			Post[]
		>`SELECT * FROM posts WHERE user_id = ${userId} ORDER BY created_at DESC`;
	},

	async create(data: NewPost): Promise<Post> {
		const [post] = await db<Post[]>`
      INSERT INTO posts ${db(data)}
      RETURNING *
    `;
		return post;
	},

	async update(id: string, data: PostUpdate): Promise<Post | null> {
		const [post] = await db<Post[]>`
      UPDATE posts SET ${db(data)}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
		return post ?? null;
	},

	async delete(id: string): Promise<boolean> {
		const [row] = await db`DELETE FROM posts WHERE id = ${id} RETURNING id`;
		return !!row;
	},
};
