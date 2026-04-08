import type { FastifyReply, FastifyRequest } from 'fastify';
import { tagService } from '@/services/tag.js';
import type { NewTag } from '@/types/tag.js';

export const tagController = {
	async getAll(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await tagService.getTags();
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getById(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await tagService.getTagById(id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Tag not found' });
		return reply.status(200).send(data);
	},

	async getByPost(request: FastifyRequest, reply: FastifyReply) {
		const { post_id } = request.params as { post_id: string };
		const { data, error } = await tagService.getTagsByPost(post_id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async create(request: FastifyRequest, reply: FastifyReply) {
		const body = request.body as NewTag;
		const { error } = await tagService.createTag(body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Tag created' });
	},

	async delete(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await tagService.deleteTag(id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Tag not found' });
		return reply.status(200).send({ message: 'Tag deleted' });
	},

	async addToPost(request: FastifyRequest, reply: FastifyReply) {
		const { post_id, tag_id } = request.params as {
			post_id: string;
			tag_id: string;
		};
		const { error } = await tagService.addTagToPost({ post_id, tag_id });
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send({ message: 'Tag added to post' });
	},

	async removeFromPost(request: FastifyRequest, reply: FastifyReply) {
		const { post_id, tag_id } = request.params as {
			post_id: string;
			tag_id: string;
		};
		const { data, error } = await tagService.removeTagFromPost(post_id, tag_id);
		if (error) return reply.status(500).send({ error });
		if (!data)
			return reply.status(404).send({ error: 'Tag not found on post' });
		return reply.status(200).send({ message: 'Tag removed from post' });
	},
};
