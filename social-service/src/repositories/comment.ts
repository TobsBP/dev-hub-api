import { db } from '@/lib/db.js';
import type { Comment, CommentUpdate, NewComment } from '@/types/comment.js';

export const commentRepository = {
	async findByPostId(postId: string): Promise<Comment[]> {
		return db<Comment[]>`
      SELECT * FROM comments WHERE post_id = ${postId} ORDER BY created_at ASC
    `;
	},

	async findById(id: string): Promise<Comment | null> {
		const [comment] = await db<
			Comment[]
		>`SELECT * FROM comments WHERE id = ${id}`;
		return comment ?? null;
	},

	async create(data: NewComment): Promise<Comment> {
		const [comment] = await db<Comment[]>`
      INSERT INTO comments ${db(data)}
      RETURNING *
    `;
		return comment;
	},

	async update(id: string, data: CommentUpdate): Promise<Comment | null> {
		const [comment] = await db<Comment[]>`
      UPDATE comments SET ${db(data)}
      WHERE id = ${id}
      RETURNING *
    `;
		return comment ?? null;
	},

	async delete(id: string): Promise<void> {
		await db`DELETE FROM comments WHERE id = ${id}`;
	},
};
