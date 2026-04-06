import type { FastifyReply, FastifyRequest } from 'fastify';
import { bookmarkService } from '@/services/bookmark.js';
import type { NewBookmark } from '@/types/bookmark.js';

export const bookmarkController = {
	async getByUser(
		request: FastifyRequest<{ Params: { user_id: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await bookmarkService.getBookmarksByUser(
			request.params.user_id,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async create(
		request: FastifyRequest<{ Body: NewBookmark }>,
		reply: FastifyReply,
	) {
		const { error } = await bookmarkService.createBookmark(request.body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Bookmark created' });
	},

	async delete(
		request: FastifyRequest<{ Params: { user_id: string; post_id: string } }>,
		reply: FastifyReply,
	) {
		const { user_id, post_id } = request.params;
		const { error } = await bookmarkService.deleteBookmark(user_id, post_id);
		if (error) return reply.status(500).send({ error });
		return reply.status(204).send();
	},
};
