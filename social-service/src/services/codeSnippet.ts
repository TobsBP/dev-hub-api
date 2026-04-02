import { withCapture } from '@/lib/sentry.js';
import { codeSnippetRepository } from '@/repositories/codeSnippet.js';
import type { CodeSnippetUpdate, NewCodeSnippet } from '@/types/codeSnippet.js';

export const codeSnippetService = {
	async getSnippetsByPost(postId: string) {
		return withCapture(() => codeSnippetRepository.findByPostId(postId));
	},

	async getSnippetById(id: string) {
		return withCapture(() => codeSnippetRepository.findById(id));
	},

	async createSnippet(payload: NewCodeSnippet) {
		return withCapture(() => codeSnippetRepository.create(payload));
	},

	async updateSnippet(id: string, payload: CodeSnippetUpdate) {
		return withCapture(() => codeSnippetRepository.update(id, payload));
	},

	async deleteSnippet(id: string) {
		return withCapture(() => codeSnippetRepository.delete(id));
	},
};
