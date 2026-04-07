import type { z } from 'zod';
import { db } from '@/lib/db.js';
import type { postSolutionSchema } from '@/types/postSolution.js';

type PostSolution = z.infer<typeof postSolutionSchema>;

export const postSolutionRepository = {
	async findByPostId(postId: string): Promise<PostSolution | null> {
		const [solution] = await db<PostSolution[]>`
      SELECT * FROM post_solutions WHERE post_id = ${postId}
    `;
		return solution ?? null;
	},

	async create(data: PostSolution): Promise<PostSolution> {
		const [solution] = await db<PostSolution[]>`
      INSERT INTO post_solutions ${db(data)}
      ON CONFLICT (post_id) DO UPDATE SET comment_id = EXCLUDED.comment_id
      RETURNING *
    `;
		return solution;
	},

	async delete(postId: string): Promise<boolean> {
		const [row] = await db`DELETE FROM post_solutions WHERE post_id = ${postId} RETURNING post_id`;
		return !!row;
	},
};
