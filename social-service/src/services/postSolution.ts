import type { z } from 'zod';
import { postSolutionRepository } from '@/repositories/postSolution.js';
import type { postSolutionSchema } from '@/types/postSolution.js';

type PostSolution = z.infer<typeof postSolutionSchema>;

export const postSolutionService = {
	async getSolutionByPost(postId: string) {
		try {
			const data = await postSolutionRepository.findByPostId(postId);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},

	async setSolution(payload: PostSolution) {
		try {
			const data = await postSolutionRepository.create(payload);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},

	async removeSolution(postId: string) {
		try {
			await postSolutionRepository.delete(postId);
			return { error: null };
		} catch (error) {
			return { error };
		}
	},
};
