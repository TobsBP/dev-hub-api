import type { FastifyReply, FastifyRequest } from 'fastify';
import { bookmarkService } from '@/services/bookmark.js';
import type { NewBookmark } from '@/types/bookmark.js';

export const bookmarkController = {
	async getByUser(request: FastifyRequest, reply: FastifyReply) {
		const { user_id } = request.params as { user_id: string };
		const { data, error } = await bookmarkService.getBookmarksByUser(user_id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async create(request: FastifyRequest, reply: FastifyReply) {
		const body = request.body as NewBookmark;
		const { error } = await bookmarkService.createBookmark(body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Bookmark created' });
	},

	async delete(request: FastifyRequest, reply: FastifyReply) {
		const { user_id, post_id } = request.params as {
			user_id: string;
			post_id: string;
		};
		const { data, error } = await bookmarkService.deleteBookmark(
			user_id,
			post_id,
		);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Bookmark not found' });
		return reply.status(200).send({ message: 'Bookmark deleted' });
	},
};
