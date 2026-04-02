import type { FastifyReply, FastifyRequest } from 'fastify';
import { bookmarkService } from '@/services/bookmark.js';
import type { NewBookmark } from '@/types/bookmark.js';

export const bookmarkController = {
	async getByUser(
		request: FastifyRequest<{ Params: { userId: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await bookmarkService.getBookmarksByUser(
			request.params.userId,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async create(
		request: FastifyRequest<{ Body: NewBookmark }>,
		reply: FastifyReply,
	) {
		const { data, error } = await bookmarkService.createBookmark(request.body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send(data);
	},

	async delete(
		request: FastifyRequest<{ Params: { userId: string; postId: string } }>,
		reply: FastifyReply,
	) {
		const { userId, postId } = request.params;
		const { error } = await bookmarkService.deleteBookmark(userId, postId);
		if (error) return reply.status(500).send({ error });
		return reply.status(204).send();
	},
};
