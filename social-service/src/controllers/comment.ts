import type { FastifyReply, FastifyRequest } from 'fastify';
import { commentService } from '@/services/comment.js';
import type { CommentUpdate, NewComment } from '@/types/comment.js';

export const commentController = {
	async getByPost(
		request: FastifyRequest<{ Params: { postId: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await commentService.getCommentsByPost(
			request.params.postId,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getById(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await commentService.getCommentById(
			request.params.id,
		);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Comment not found' });
		return reply.status(200).send(data);
	},

	async create(
		request: FastifyRequest<{ Body: NewComment }>,
		reply: FastifyReply,
	) {
		const { error } = await commentService.createComment(request.body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Comment created' });
	},

	async update(
		request: FastifyRequest<{ Params: { id: string }; Body: CommentUpdate }>,
		reply: FastifyReply,
	) {
		const { data, error } = await commentService.updateComment(
			request.params.id,
			request.body,
		);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Comment not found' });
		return reply.status(200).send({ message: 'Comment updated' });
	},

	async delete(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { error } = await commentService.deleteComment(request.params.id);
		if (error) return reply.status(500).send({ error });
		return reply.status(204).send();
	},
};
