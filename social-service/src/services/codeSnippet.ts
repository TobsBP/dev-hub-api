import { codeSnippetRepository } from '@/repositories/codeSnippet.js';
import type { CodeSnippetUpdate, NewCodeSnippet } from '@/types/codeSnippet.js';
import { captureException } from '@/lib/sentry.js';

export const codeSnippetService = {
	async getSnippetsByPost(postId: string) {
		try {
			const data = await codeSnippetRepository.findByPostId(postId);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async getSnippetById(id: string) {
		try {
			const data = await codeSnippetRepository.findById(id);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async createSnippet(payload: NewCodeSnippet) {
		try {
			const data = await codeSnippetRepository.create(payload);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async updateSnippet(id: string, payload: CodeSnippetUpdate) {
		try {
			const data = await codeSnippetRepository.update(id, payload);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async deleteSnippet(id: string) {
		try {
			await codeSnippetRepository.delete(id);
			return { error: null };
		} catch (error) {
			captureException(error);
			return { error };
		}
	},
};
