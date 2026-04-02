import { withCapture } from '@/lib/sentry.js';
import { postRepository } from '@/repositories/post.js';
import type { NewPost, PostUpdate } from '@/types/post.js';

export const postService = {
	async getPosts() {
		return withCapture(() => postRepository.findAll());
	},

	async getPostById(id: string) {
		return withCapture(() => postRepository.findById(id));
	},

	async getPostsByUser(userId: string) {
		return withCapture(() => postRepository.findByUserId(userId));
	},

	async createPost(payload: NewPost) {
		return withCapture(() => postRepository.create(payload));
	},

	async updatePost(id: string, payload: PostUpdate) {
		return withCapture(() => postRepository.update(id, payload));
	},

	async deletePost(id: string) {
		return withCapture(() => postRepository.delete(id));
	},
};
