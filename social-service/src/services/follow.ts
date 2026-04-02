import { followRepository } from '@/repositories/follow.js';
import type { NewFollow } from '@/types/follow.js';

export const followService = {
	async getFollowers(userId: string) {
		try {
			const data = await followRepository.findFollowers(userId);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},

	async getFollowing(userId: string) {
		try {
			const data = await followRepository.findFollowing(userId);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},

	async follow(payload: NewFollow) {
		try {
			const data = await followRepository.create(payload);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},

	async unfollow(followerId: string, followingId: string) {
		try {
			await followRepository.delete(followerId, followingId);
			return { error: null };
		} catch (error) {
			return { error };
		}
	},
};
