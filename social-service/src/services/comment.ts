import { captureException } from '@/lib/sentry.js';
import { commentRepository } from '@/repositories/comment.js';
import type { CommentUpdate, NewComment } from '@/types/comment.js';

export const commentService = {
	async getCommentsByPost(postId: string) {
		try {
			const data = await commentRepository.findByPostId(postId);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async getCommentById(id: string) {
		try {
			const data = await commentRepository.findById(id);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async createComment(payload: NewComment) {
		try {
			const data = await commentRepository.create(payload);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async updateComment(id: string, payload: CommentUpdate) {
		try {
			const data = await commentRepository.update(id, payload);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async deleteComment(id: string) {
		try {
			await commentRepository.delete(id);
			return { error: null };
		} catch (error) {
			captureException(error);
			return { error };
		}
	},
};
