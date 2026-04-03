import bcrypt from 'bcryptjs';
import { uploadStream } from '@/lib/cloudinary.js';
import { withCapture } from '@/lib/sentry.js';
import { userRepository } from '@/repositories/user.js';
import type { NewUserInput, UserUpdate } from '@/types/user.js';

export const userService = {
	async getUsers() {
		return withCapture(() => userRepository.findAll());
	},

	async getUserById(id: string) {
		return withCapture(() => userRepository.findById(id));
	},

	async createUser(payload: NewUserInput) {
		const password_hash = await bcrypt.hash(payload.password, 10);
		const avatar_url = payload.avatarStream
			? await uploadStream(payload.avatarStream, 'avatars')
			: null;
		const { password: _p, avatarStream: _s, ...rest } = payload;
		return withCapture(() =>
			userRepository.create({ ...rest, password_hash, avatar_url }),
		);
	},

	async updateUser(id: string, payload: UserUpdate) {
		const avatar_url = payload.avatarStream
			? await uploadStream(payload.avatarStream, 'avatars')
			: undefined;
		const { avatarStream: _s, ...rest } = payload;
		return withCapture(() =>
			userRepository.update(id, avatar_url ? { ...rest, avatar_url } : rest),
		);
	},

	async deleteUser(id: string) {
		return withCapture(() => userRepository.delete(id));
	},
};
