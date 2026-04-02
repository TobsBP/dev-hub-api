import { withCapture } from '@/lib/sentry.js';
import { followRepository } from '@/repositories/follow.js';
import type { NewFollow } from '@/types/follow.js';

export const followService = {
	async getFollowers(userId: string) {
		return withCapture(() => followRepository.findFollowers(userId));
	},

	async getFollowing(userId: string) {
		return withCapture(() => followRepository.findFollowing(userId));
	},

	async follow(payload: NewFollow) {
		return withCapture(() => followRepository.create(payload));
	},

	async unfollow(followerId: string, followingId: string) {
		return withCapture(() => followRepository.delete(followerId, followingId));
	},
};
