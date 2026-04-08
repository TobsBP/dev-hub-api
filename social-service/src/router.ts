import type { FastifyInstance } from 'fastify';
import { authRoutes } from '@/routes/auth.js';
import { bookmarkRoutes } from '@/routes/bookmark.js';
import { codeSnippetRoutes } from '@/routes/codeSnippet.js';
import { commentRoutes } from '@/routes/comment.js';
import { followRoutes } from '@/routes/follow.js';
import { likeRoutes } from '@/routes/like.js';
import { postRoutes } from '@/routes/post.js';
import { postSolutionRoutes } from '@/routes/postSolution.js';
import { reputationRoutes } from '@/routes/reputation.js';
import { tagRoutes } from '@/routes/tag.js';
import { userRoutes } from '@/routes/user.js';

export const routes = async (app: FastifyInstance) => {
	app.register(authRoutes);
	app.register(postRoutes);
	app.register(userRoutes);
	app.register(commentRoutes);
	app.register(likeRoutes);
	app.register(followRoutes);
	app.register(tagRoutes);
	app.register(codeSnippetRoutes);
	app.register(bookmarkRoutes);
	app.register(postSolutionRoutes);
	app.register(reputationRoutes);
};
