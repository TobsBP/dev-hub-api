import { captureException } from '@/lib/sentry.js';
import { postRepository } from '@/repositories/post.js';
import type { NewPost, PostUpdate } from '@/types/post.js';

export const postService = {
	async getPosts() {
		try {
			const data = await postRepository.findAll();
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async getPostById(id: string) {
		try {
			const data = await postRepository.findById(id);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async getPostsByUser(userId: string) {
		try {
			const data = await postRepository.findByUserId(userId);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async createPost(payload: NewPost) {
		try {
			const data = await postRepository.create(payload);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async updatePost(id: string, payload: PostUpdate) {
		try {
			const data = await postRepository.update(id, payload);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async deletePost(id: string) {
		try {
			await postRepository.delete(id);
			return { error: null };
		} catch (error) {
			captureException(error);
			return { error };
		}
	},
};
