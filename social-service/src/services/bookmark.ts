import { withCapture } from '@/lib/sentry.js';
import { bookmarkRepository } from '@/repositories/bookmark.js';
import type { NewBookmark } from '@/types/bookmark.js';

export const bookmarkService = {
	async getBookmarksByUser(userId: string) {
		return withCapture(() => bookmarkRepository.findByUserId(userId));
	},

	async createBookmark(payload: NewBookmark) {
		return withCapture(() => bookmarkRepository.create(payload));
	},

	async deleteBookmark(userId: string, postId: string) {
		return withCapture(() => bookmarkRepository.delete(userId, postId));
	},
};
