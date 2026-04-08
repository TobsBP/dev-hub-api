import type { FastifyReply, FastifyRequest } from 'fastify';
import { codeSnippetService } from '@/services/codeSnippet.js';
import type { CodeSnippetUpdate, NewCodeSnippet } from '@/types/codeSnippet.js';

export const codeSnippetController = {
	async getByPost(request: FastifyRequest, reply: FastifyReply) {
		const { post_id } = request.params as { post_id: string };
		const { data, error } = await codeSnippetService.getSnippetsByPost(post_id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getById(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await codeSnippetService.getSnippetById(id);
		if (error) return reply.status(500).send({ error });
		if (!data)
			return reply.status(404).send({ error: 'Code snippet not found' });
		return reply.status(200).send(data);
	},

	async create(request: FastifyRequest, reply: FastifyReply) {
		const body = request.body as NewCodeSnippet;
		const { error } = await codeSnippetService.createSnippet(body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Code snippet created' });
	},

	async update(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const body = request.body as CodeSnippetUpdate;
		const { data, error } = await codeSnippetService.updateSnippet(id, body);
		if (error) return reply.status(500).send({ error });
		if (!data)
			return reply.status(404).send({ error: 'Code snippet not found' });
		return reply.status(200).send({ message: 'Code snippet updated' });
	},

	async delete(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await codeSnippetService.deleteSnippet(id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Snippet not found' });
		return reply.status(200).send({ message: 'Snippet deleted' });
	},
};
