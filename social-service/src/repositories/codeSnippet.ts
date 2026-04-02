import { db } from '@/lib/db.js';
import type {
	CodeSnippet,
	CodeSnippetUpdate,
	NewCodeSnippet,
} from '@/types/codeSnippet.js';

export const codeSnippetRepository = {
	async findByPostId(postId: string): Promise<CodeSnippet[]> {
		return db<
			CodeSnippet[]
		>`SELECT * FROM code_snippets WHERE post_id = ${postId}`;
	},

	async findById(id: string): Promise<CodeSnippet | null> {
		const [snippet] = await db<
			CodeSnippet[]
		>`SELECT * FROM code_snippets WHERE id = ${id}`;
		return snippet ?? null;
	},

	async create(data: NewCodeSnippet): Promise<CodeSnippet> {
		const [snippet] = await db<CodeSnippet[]>`
      INSERT INTO code_snippets ${db(data)}
      RETURNING *
    `;
		return snippet;
	},

	async update(
		id: string,
		data: CodeSnippetUpdate,
	): Promise<CodeSnippet | null> {
		const [snippet] = await db<CodeSnippet[]>`
      UPDATE code_snippets SET ${db(data)}
      WHERE id = ${id}
      RETURNING *
    `;
		return snippet ?? null;
	},

	async delete(id: string): Promise<void> {
		await db`DELETE FROM code_snippets WHERE id = ${id}`;
	},
};
