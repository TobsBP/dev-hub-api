import { withCapture } from '@/lib/sentry.js';
import { reputationRepository } from '@/repositories/reputation.js';
import type { NewReputation } from '@/types/reputation.js';

export const reputationService = {
	async getReputationByUser(userId: string) {
		return withCapture(() => reputationRepository.findByUserId(userId));
	},

	async addReputation(payload: NewReputation) {
		return withCapture(() => reputationRepository.create(payload));
	},
};
