import { db } from '@/lib/db.js';
import type { NewUser, User, UserUpdateRecord } from '@/types/user.js';

export const userRepository = {
	async findAll(): Promise<User[]> {
		return db<User[]>`SELECT * FROM users ORDER BY created_at DESC`;
	},

	async findById(id: string): Promise<User | null> {
		const [user] = await db<User[]>`SELECT * FROM users WHERE id = ${id}`;
		return user ?? null;
	},

	async findByEmail(email: string): Promise<User | null> {
		const [user] = await db<User[]>`SELECT * FROM users WHERE email = ${email}`;
		return user ?? null;
	},

	async create(data: NewUser): Promise<User> {
		const [user] = await db<User[]>`
      INSERT INTO users ${db(data)}
      RETURNING *
    `;
		return user;
	},

	async update(id: string, data: UserUpdateRecord): Promise<User | null> {
		const [user] = await db<User[]>`
      UPDATE users SET ${db(data)}
      WHERE id = ${id}
      RETURNING *
    `;
		return user ?? null;
	},

	async delete(id: string): Promise<void> {
		await db`DELETE FROM users WHERE id = ${id}`;
	},
};
