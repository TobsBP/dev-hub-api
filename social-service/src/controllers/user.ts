import type { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from '@/services/user.js';
import type { NewUser, UserUpdate } from '@/types/user.js';

export const userController = {
	async getAll(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await userService.getUsers();
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getById(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { data, error } = await userService.getUserById(request.params.id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'User not found' });
		return reply.status(200).send(data);
	},

	async create(
		request: FastifyRequest<{ Body: NewUser }>,
		reply: FastifyReply,
	) {
		const { data, error } = await userService.createUser(request.body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send(data);
	},

	async update(
		request: FastifyRequest<{ Params: { id: string }; Body: UserUpdate }>,
		reply: FastifyReply,
	) {
		const { data, error } = await userService.updateUser(
			request.params.id,
			request.body,
		);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'User not found' });
		return reply.status(200).send(data);
	},

	async delete(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const { error } = await userService.deleteUser(request.params.id);
		if (error) return reply.status(500).send({ error });
		return reply.status(204).send();
	},
};
