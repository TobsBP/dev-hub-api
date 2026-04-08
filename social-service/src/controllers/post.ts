import type { FastifyReply, FastifyRequest } from 'fastify';
import { postService } from '@/services/post.js';
import type { PostUpdate } from '@/types/post.js';

export const postController = {
	async getAll(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await postService.getPosts();
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getById(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await postService.getPostById(id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Post not found' });
		return reply.status(200).send(data);
	},

	async getByUser(request: FastifyRequest, reply: FastifyReply) {
		const { user_id } = request.params as { user_id: string };
		const { data, error } = await postService.getPostsByUser(user_id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async create(request: FastifyRequest, reply: FastifyReply) {
		const parts = request.parts();
		const fields: Record<string, string> = {};
		let imageStream: import('node:stream').Readable | undefined;

		for await (const part of parts) {
			if (part.type === 'file' && part.fieldname === 'image') {
				imageStream = part.file;
			} else if (part.type === 'field') {
				fields[part.fieldname] = part.value as string;
			}
		}

		const { error } = await postService.createPost({
			user_id: fields.user_id,
			content: fields.content,
			type: fields.type,
			imageStream,
		});
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Post created' });
	},

	async update(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const body = request.body as PostUpdate;
		const { data, error } = await postService.updatePost(id, body);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Post not found' });
		return reply.status(200).send({ message: 'Post updated' });
	},

	async delete(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await postService.deletePost(id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Post not found' });
		return reply.status(200).send({ message: 'Post deleted' });
	},
};
