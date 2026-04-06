import type { FastifyReply, FastifyRequest } from 'fastify';
import { tagService } from '@/services/tag.js';
import type { NewTag } from '@/types/tag.js';

export const tagController = {
	async getAll(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await tagService.getTags();
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getById(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await tagService.getTagById(request.params.id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Tag not found' });
		return reply.status(200).send(data);
	},

	async getByPost(
		request: FastifyRequest<{ Params: { post_id: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await tagService.getTagsByPost(
			request.params.post_id,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async create(request: FastifyRequest<{ Body: NewTag }>, reply: FastifyReply) {
		const { error } = await tagService.createTag(request.body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Tag created' });
	},

	async delete(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { error } = await tagService.deleteTag(request.params.id);
		if (error) return reply.status(500).send({ error });
		return reply.status(204).send();
	},

	async addToPost(
		request: FastifyRequest<{ Params: { post_id: string; tag_id: string } }>,
		reply: FastifyReply,
	) {
		const { post_id, tag_id } = request.params;
		const { error } = await tagService.addTagToPost({ post_id, tag_id });
		if (error) return reply.status(500).send({ error });
		return reply.status(204).send();
	},

	async removeFromPost(
		request: FastifyRequest<{ Params: { post_id: string; tag_id: string } }>,
		reply: FastifyReply,
	) {
		const { post_id, tag_id } = request.params;
		const { error } = await tagService.removeTagFromPost(post_id, tag_id);
		if (error) return reply.status(500).send({ error });
		return reply.status(204).send();
	},
};
