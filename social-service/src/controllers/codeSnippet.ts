import type { FastifyReply, FastifyRequest } from 'fastify';
import { codeSnippetService } from '@/services/codeSnippet.js';
import type { CodeSnippetUpdate, NewCodeSnippet } from '@/types/codeSnippet.js';

export const codeSnippetController = {
	async getByPost(
		request: FastifyRequest<{ Params: { postId: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await codeSnippetService.getSnippetsByPost(
			request.params.postId,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getById(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await codeSnippetService.getSnippetById(
			request.params.id,
		);
		if (error) return reply.status(500).send({ error });
		if (!data)
			return reply.status(404).send({ error: 'Code snippet not found' });
		return reply.status(200).send(data);
	},

	async create(
		request: FastifyRequest<{ Body: NewCodeSnippet }>,
		reply: FastifyReply,
	) {
		const { data, error } = await codeSnippetService.createSnippet(
			request.body,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send(data);
	},

	async update(
		request: FastifyRequest<{
			Params: { id: string };
			Body: CodeSnippetUpdate;
		}>,
		reply: FastifyReply,
	) {
		const { data, error } = await codeSnippetService.updateSnippet(
			request.params.id,
			request.body,
		);
		if (error) return reply.status(500).send({ error });
		if (!data)
			return reply.status(404).send({ error: 'Code snippet not found' });
		return reply.status(200).send(data);
	},

	async delete(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { error } = await codeSnippetService.deleteSnippet(request.params.id);
		if (error) return reply.status(500).send({ error });
		return reply.status(204).send();
	},
};
