import { tagRepository } from '@/repositories/tag.js';
import type { NewTag, PostTag } from '@/types/tag.js';

export const tagService = {
	async getTags() {
		try {
			const data = await tagRepository.findAll();
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},

	async getTagById(id: string) {
		try {
			const data = await tagRepository.findById(id);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},

	async getTagsByPost(postId: string) {
		try {
			const data = await tagRepository.findByPostId(postId);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},

	async createTag(payload: NewTag) {
		try {
			const data = await tagRepository.create(payload);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},

	async deleteTag(id: string) {
		try {
			await tagRepository.delete(id);
			return { error: null };
		} catch (error) {
			return { error };
		}
	},

	async addTagToPost(payload: PostTag) {
		try {
			await tagRepository.addToPost(payload);
			return { error: null };
		} catch (error) {
			return { error };
		}
	},

	async removeTagFromPost(postId: string, tagId: string) {
		try {
			await tagRepository.removeFromPost(postId, tagId);
			return { error: null };
		} catch (error) {
			return { error };
		}
	},
};
