import { db } from '@/lib/db.js';
import type { Follow, NewFollow } from '@/types/follow.js';

export const followRepository = {
	async findFollowers(userId: string): Promise<Follow[]> {
		return db<Follow[]>`SELECT * FROM follows WHERE following_id = ${userId}`;
	},

	async findFollowing(userId: string): Promise<Follow[]> {
		return db<Follow[]>`SELECT * FROM follows WHERE follower_id = ${userId}`;
	},

	async create(data: NewFollow): Promise<Follow> {
		const [follow] = await db<Follow[]>`
      INSERT INTO follows ${db(data)}
      RETURNING *
    `;
		return follow;
	},

	async delete(
		followerId: string,
		followingId: string,
	): Promise<Follow | null> {
		const [row] = await db<Follow[]>`
      DELETE FROM follows
      WHERE follower_id = ${followerId} AND following_id = ${followingId}
      RETURNING *
    `;
		return row ?? null;
	},
};
