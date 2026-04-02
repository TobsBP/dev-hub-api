import { z } from 'zod';

export const postSolutionSchema = z.object({
	post_id: z.uuid(),
	comment_id: z.uuid(),
});

export const getPostSolutionsSchema = {
	description: 'Get all post solutions',
	response: {
		200: z.array(postSolutionSchema),
	},
};

export type PostSolution = z.infer<typeof postSolutionSchema>;
export type NewPostSolution = PostSolution;
