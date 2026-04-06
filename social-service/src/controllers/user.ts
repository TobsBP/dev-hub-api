import type { Readable } from 'node:stream';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from '@/services/user.js';

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

	async create(request: FastifyRequest, reply: FastifyReply) {
		const parts = request.parts();
		const fields: Record<string, string> = {};
		let avatarStream: import('node:stream').Readable | undefined;

		for await (const part of parts) {
			if (part.type === 'file' && part.fieldname === 'avatar') {
				avatarStream = part.file;
			} else if (part.type === 'field') {
				fields[part.fieldname] = part.value as string;
			}
		}

		const { error } = await userService.createUser({
			username: fields.username,
			email: fields.email,
			password: fields.password,
			bio: fields.bio ?? null,
			avatarStream,
		});
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'User created' });
	},

	async update(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const parts = request.parts();
		const fields: Record<string, string> = {};
		let avatarStream: Readable | undefined;

		for await (const part of parts) {
			if (part.type === 'file' && part.fieldname === 'avatar') {
				avatarStream = part.file;
			} else if (part.type === 'field') {
				fields[part.fieldname] = part.value as string;
			}
		}

		const payload = { ...fields, avatarStream } as Parameters<
			typeof userService.updateUser
		>[1];

		const { data, error } = await userService.updateUser(
			request.params.id,
			payload,
		);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'User not found' });
		return reply.status(200).send({ message: 'User updated' });
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
