import { withCapture } from '@/lib/sentry.js';
import { likeRepository } from '@/repositories/like.js';
import type { NewLike } from '@/types/like.js';

export const likeService = {
	async getLikesByTarget(targetType: string, targetId: string) {
		return withCapture(() => likeRepository.findByTarget(targetType, targetId));
	},

	async createLike(payload: NewLike) {
		return withCapture(() => likeRepository.create(payload));
	},

	async deleteLike(userId: string, targetType: string, targetId: string) {
		return withCapture(() => likeRepository.delete(userId, targetType, targetId));
	},
};
