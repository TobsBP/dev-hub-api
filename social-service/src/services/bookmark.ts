import { bookmarkRepository } from '@/repositories/bookmark.js';
import type { NewBookmark } from '@/types/bookmark.js';

export const bookmarkService = {
	async getBookmarksByUser(userId: string) {
		try {
			const data = await bookmarkRepository.findByUserId(userId);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},

	async createBookmark(payload: NewBookmark) {
		try {
			const data = await bookmarkRepository.create(payload);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},

	async deleteBookmark(userId: string, postId: string) {
		try {
			await bookmarkRepository.delete(userId, postId);
			return { error: null };
		} catch (error) {
			return { error };
		}
	},
};
