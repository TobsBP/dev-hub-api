import { captureException } from '@/lib/sentry.js';
import { userRepository } from '@/repositories/user.js';
import type { NewUser, UserUpdate } from '@/types/user.js';

export const userService = {
	async getUsers() {
		try {
			const data = await userRepository.findAll();
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async getUserById(id: string) {
		try {
			const data = await userRepository.findById(id);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async createUser(payload: NewUser) {
		try {
			const data = await userRepository.create(payload);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async updateUser(id: string, payload: UserUpdate) {
		try {
			const data = await userRepository.update(id, payload);
			return { data, error: null };
		} catch (error) {
			captureException(error);
			return { data: null, error };
		}
	},

	async deleteUser(id: string) {
		try {
			await userRepository.delete(id);
			return { error: null };
		} catch (error) {
			captureException(error);
			return { error };
		}
	},
};
