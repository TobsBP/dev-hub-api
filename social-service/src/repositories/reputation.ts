import { db } from '@/lib/db.js';
import type { NewReputation, Reputation } from '@/types/reputation.js';

export const reputationRepository = {
	async findByUserId(userId: string): Promise<Reputation[]> {
		return db<Reputation[]>`
      SELECT * FROM reputation WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
	},

	async create(data: NewReputation): Promise<Reputation> {
		const [entry] = await db<Reputation[]>`
      INSERT INTO reputation ${db(data)}
      RETURNING *
    `;
		return entry;
	},
};
