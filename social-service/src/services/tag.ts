import { withCapture } from '@/lib/sentry.js';
import { tagRepository } from '@/repositories/tag.js';
import type { NewTag, PostTag } from '@/types/tag.js';

export const tagService = {
	async getTags() {
		return withCapture(() => tagRepository.findAll());
	},

	async getTagById(id: string) {
		return withCapture(() => tagRepository.findById(id));
	},

	async getTagsByPost(postId: string) {
		return withCapture(() => tagRepository.findByPostId(postId));
	},

	async createTag(payload: NewTag) {
		return withCapture(() => tagRepository.create(payload));
	},

	async deleteTag(id: string) {
		return withCapture(() => tagRepository.delete(id));
	},

	async addTagToPost(payload: PostTag) {
		return withCapture(() => tagRepository.addToPost(payload));
	},

	async removeTagFromPost(postId: string, tagId: string) {
		return withCapture(() => tagRepository.removeFromPost(postId, tagId));
	},
};
