import { z } from 'zod';

export const userSchema = z.object({
	id: z.uuid(),
	username: z.string().max(50),
	email: z.email().max(100),
	password_hash: z.string(),
	bio: z.string().nullable(),
	avatar_url: z.string().nullable(),
	created_at: z.string(),
});

export const getUsersSchema = {
	description: 'Get all users',
	response: {
		200: z.array(userSchema),
	},
};

export type User = z.infer<typeof userSchema>;
export type NewUser = Omit<User, 'id' | 'created_at'>;
export type UserUpdate = Partial<Omit<NewUser, 'password_hash'>>;
