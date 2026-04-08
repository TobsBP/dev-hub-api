import { uploadStream } from '@/lib/cloudinary.js';
import { withCapture } from '@/lib/sentry.js';
import { postRepository } from '@/repositories/post.js';
import type { NewPostInput, PostUpdate } from '@/types/post.js';

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

	async createPost(payload: NewPostInput) {
		const image_url = payload.imageStream
			? await uploadStream(payload.imageStream, 'posts')
			: null;
		const { imageStream: _s, ...rest } = payload;
		return withCapture(() => postRepository.create({ ...rest, image_url }));
	},

	async updatePost(id: string, payload: PostUpdate) {
		return withCapture(() => postRepository.update(id, payload));
	},

	async deletePost(id: string) {
		return withCapture(() => postRepository.delete(id));
	},
};
