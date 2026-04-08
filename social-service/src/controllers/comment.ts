import type { FastifyReply, FastifyRequest } from 'fastify';
import { commentService } from '@/services/comment.js';
import type { CommentUpdate, NewComment } from '@/types/comment.js';

export const commentController = {
	async getByPost(request: FastifyRequest, reply: FastifyReply) {
		const { post_id } = request.params as { post_id: string };
		const { data, error } = await commentService.getCommentsByPost(post_id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getById(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await commentService.getCommentById(id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Comment not found' });
		return reply.status(200).send(data);
	},

	async create(request: FastifyRequest, reply: FastifyReply) {
		const body = request.body as NewComment;
		const { error } = await commentService.createComment(body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Comment created' });
	},

	async update(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const body = request.body as CommentUpdate;
		const { data, error } = await commentService.updateComment(id, body);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Comment not found' });
		return reply.status(200).send({ message: 'Comment updated' });
	},

	async delete(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await commentService.deleteComment(id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Comment not found' });
		return reply.status(200).send({ message: 'Comment deleted' });
	},
};
