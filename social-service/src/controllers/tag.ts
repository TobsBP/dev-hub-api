import type { FastifyReply, FastifyRequest } from 'fastify';
import { tagService } from '@/services/tag.js';
import type { NewTag, PostTag } from '@/types/tag.js';

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
		request: FastifyRequest<{ Params: { postId: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await tagService.getTagsByPost(
			request.params.postId,
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
		request: FastifyRequest<{ Body: PostTag }>,
		reply: FastifyReply,
	) {
		const { error } = await tagService.addTagToPost(request.body);
		if (error) return reply.status(500).send({ error });
		return reply.status(204).send();
	},

	async removeFromPost(
		request: FastifyRequest<{ Params: { postId: string; tagId: string } }>,
		reply: FastifyReply,
	) {
		const { postId, tagId } = request.params;
		const { error } = await tagService.removeTagFromPost(postId, tagId);
		if (error) return reply.status(500).send({ error });
		return reply.status(204).send();
	},
};
