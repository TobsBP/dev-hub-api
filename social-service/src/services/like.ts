import { likeRepository } from '@/repositories/like.js';
import type { NewLike } from '@/types/like.js';
import { captureException } from '@/lib/sentry.js';

export const likeService = {
	async getLikesByTarget(targetType: string, targetId: string) {
		try {
			const data = await likeRepository.findByTarget(targetType, targetId);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async createLike(payload: NewLike) {
		try {
			const data = await likeRepository.create(payload);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async deleteLike(userId: string, targetType: string, targetId: string) {
		try {
			await likeRepository.delete(userId, targetType, targetId);
			return { error: null };
		} catch (error) {
			captureException(error);
			return { error };
		}
	},
};
