import { reputationRepository } from '@/repositories/reputation.js';
import type { NewReputation } from '@/types/reputation.js';

export const reputationService = {
	async getReputationByUser(userId: string) {
		try {
			const data = await reputationRepository.findByUserId(userId);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},

	async addReputation(payload: NewReputation) {
		try {
			const data = await reputationRepository.create(payload);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	},
};
