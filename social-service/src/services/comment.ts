import { withCapture } from '@/lib/sentry.js';
import { commentRepository } from '@/repositories/comment.js';
import type { CommentUpdate, NewComment } from '@/types/comment.js';

export const commentService = {
	async getCommentsByPost(postId: string) {
		return withCapture(() => commentRepository.findByPostId(postId));
	},

	async getCommentById(id: string) {
		return withCapture(() => commentRepository.findById(id));
	},

	async createComment(payload: NewComment) {
		return withCapture(() => commentRepository.create(payload));
	},

	async updateComment(id: string, payload: CommentUpdate) {
		return withCapture(() => commentRepository.update(id, payload));
	},

	async deleteComment(id: string) {
		return withCapture(() => commentRepository.delete(id));
	},
};
