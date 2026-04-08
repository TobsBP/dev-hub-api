import type { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from '@/services/user.js';
import { buildTokenResponse } from '@/utils/buildTokenResponse.js';

export const authController = {
	async login(
		request: FastifyRequest<{ Body: { email: string; password: string } }>,
		reply: FastifyReply,
	) {
		const { email, password } = request.body;

		const { data: user, error } = await userService.login(email, password);

		if (error) return reply.status(500).send({ error });
		if (!user) return reply.status(401).send({ error: 'Invalid credentials' });

		return reply.status(200).send(buildTokenResponse(request.server, user));
	},

	async register(request: FastifyRequest, reply: FastifyReply) {
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

		if (error) {
			if ((error as { code?: string }).code === '23505')
				return reply.status(409).send({ error: 'Email already in use' });
			return reply.status(500).send({ error });
		}

		const { data: user, error: loginError } = await userService.login(
			fields.email,
			fields.password,
		);

		if (loginError || !user)
			return reply
				.status(500)
				.send({ error: 'Registration succeeded but login failed' });

		return reply.status(201).send(buildTokenResponse(request.server, user));
	},
};
