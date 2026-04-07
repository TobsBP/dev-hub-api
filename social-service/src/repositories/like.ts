import { db } from '@/lib/db.js';
import type { Like, NewLike } from '@/types/like.js';

export const likeRepository = {
	async findByTarget(targetType: string, targetId: string): Promise<Like[]> {
		return db<Like[]>`
      SELECT * FROM likes WHERE target_type = ${targetType} AND target_id = ${targetId}
    `;
	},

	async create(data: NewLike): Promise<Like> {
		const [like] = await db<Like[]>`
      INSERT INTO likes ${db(data)}
      RETURNING *
    `;
		return like;
	},

	async delete(
		userId: string,
		targetType: string,
		targetId: string,
	): Promise<Like | null> {
		const [row] = await db<Like[]>`
      DELETE FROM likes
      WHERE user_id = ${userId} AND target_type = ${targetType} AND target_id = ${targetId}
      RETURNING *
    `;
		return row ?? null;
	},
};
