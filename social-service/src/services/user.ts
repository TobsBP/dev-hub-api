import { withCapture } from '@/lib/sentry.js';
import { userRepository } from '@/repositories/user.js';
import type { NewUser, UserUpdate } from '@/types/user.js';

export const userService = {
	async getUsers() {
		return withCapture(() => userRepository.findAll());
	},

	async getUserById(id: string) {
		return withCapture(() => userRepository.findById(id));
	},

	async createUser(payload: NewUser) {
		return withCapture(() => userRepository.create(payload));
	},

	async updateUser(id: string, payload: UserUpdate) {
		return withCapture(() => userRepository.update(id, payload));
	},

	async deleteUser(id: string) {
		return withCapture(() => userRepository.delete(id));
	},
};
