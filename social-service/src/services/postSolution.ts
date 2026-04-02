import type { z } from 'zod';
import { withCapture } from '@/lib/sentry.js';
import { postSolutionRepository } from '@/repositories/postSolution.js';
import type { postSolutionSchema } from '@/types/postSolution.js';

type PostSolution = z.infer<typeof postSolutionSchema>;

export const postSolutionService = {
	async getSolutionByPost(postId: string) {
		return withCapture(() => postSolutionRepository.findByPostId(postId));
	},

	async setSolution(payload: PostSolution) {
		return withCapture(() => postSolutionRepository.create(payload));
	},

	async removeSolution(postId: string) {
		return withCapture(() => postSolutionRepository.delete(postId));
	},
};
