import { z } from 'zod';

export const codeSnippetSchema = z.object({
	id: z.uuid(),
	post_id: z.uuid(),
	language: z.string().max(30).nullable(),
	code: z.string().min(1),
});

export const getCodeSnippetsSchema = {
	description: 'Get all code snippets',
	response: {
		200: z.array(codeSnippetSchema),
	},
};

export type CodeSnippet = z.infer<typeof codeSnippetSchema>;
export type NewCodeSnippet = Omit<CodeSnippet, 'id'>;
export type CodeSnippetUpdate = Partial<Omit<NewCodeSnippet, 'post_id'>>;
