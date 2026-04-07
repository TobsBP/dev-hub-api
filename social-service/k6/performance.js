import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Rate } from 'k6/metrics';

const BASE_URL = __ENV.API_BASE_URL;

const SAMPLE_USER_ID = __ENV.PERF_USER_ID;
const SAMPLE_POST_ID = __ENV.PERF_POST_ID;
const SAMPLE_COMMENT_ID = __ENV.PERF_COMMENT_ID;
const SAMPLE_TAG_ID = __ENV.PERF_TAG_ID;
const SAMPLE_SNIPPET_ID = __ENV.PERF_SNIPPET_ID;

export const options = {
	stages: [
		{ duration: '30s', target: 10 }, // ramp up
		{ duration: '1m', target: 10 }, // steady state
		{ duration: '30s', target: 30 }, // spike
		{ duration: '30s', target: 0 }, // ramp down
	],
	thresholds: {
		http_req_failed: ['rate<0.05'], // <5% errors
		http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
		'group_duration{group:::Posts}': ['p(95)<600'],
		'group_duration{group:::Users}': ['p(95)<600'],
		'group_duration{group:::Comments}': ['p(95)<600'],
		'group_duration{group:::Follows}': ['p(95)<600'],
		'group_duration{group:::Likes}': ['p(95)<600'],
		'group_duration{group:::Tags}': ['p(95)<600'],
		'group_duration{group:::Bookmarks}': ['p(95)<600'],
		'group_duration{group:::Reputation}': ['p(95)<600'],
		'group_duration{group:::CodeSnippets}': ['p(95)<600'],
		'group_duration{group:::PostSolution}': ['p(95)<600'],
	},
};

const errorRate = new Rate('errors');

function assertOk(res, name) {
	const ok = check(res, {
		[`${name} → status 2xx`]: (r) => r.status >= 200 && r.status < 300,
		[`${name} → response time < 1s`]: (r) => r.timings.duration < 1000,
	});
	errorRate.add(!ok);
}

export default function () {
	group('Posts', () => {
		let res = http.get(`${BASE_URL}/posts`);
		assertOk(res, 'GET /posts');

		res = http.get(`${BASE_URL}/post/${SAMPLE_POST_ID}`);
		assertOk(res, 'GET /post/:id');

		res = http.get(`${BASE_URL}/posts/${SAMPLE_USER_ID}`);
		assertOk(res, 'GET /posts/:userId');
	});

	group('Users', () => {
		let res = http.get(`${BASE_URL}/users`);
		assertOk(res, 'GET /users');

		res = http.get(`${BASE_URL}/user/${SAMPLE_USER_ID}`);
		assertOk(res, 'GET /user/:id');
	});

	group('Comments', () => {
		let res = http.get(`${BASE_URL}/comments/${SAMPLE_POST_ID}`);
		assertOk(res, 'GET /comments/:postId');

		res = http.get(`${BASE_URL}/comment/${SAMPLE_COMMENT_ID}`);
		assertOk(res, 'GET /comment/:id');
	});

	group('Follows', () => {
		let res = http.get(`${BASE_URL}/followers/${SAMPLE_USER_ID}`);
		assertOk(res, 'GET /followers/:userId');

		res = http.get(`${BASE_URL}/following/${SAMPLE_USER_ID}`);
		assertOk(res, 'GET /following/:userId');
	});

	group('Likes', () => {
		let res = http.get(`${BASE_URL}/likes/post/${SAMPLE_POST_ID}`);
		assertOk(res, 'GET /likes/post/:targetId');

		res = http.get(`${BASE_URL}/likes/comment/${SAMPLE_COMMENT_ID}`);
		assertOk(res, 'GET /likes/comment/:targetId');
	});

	group('Tags', () => {
		let res = http.get(`${BASE_URL}/tags`);
		assertOk(res, 'GET /tags');

		res = http.get(`${BASE_URL}/tag/${SAMPLE_TAG_ID}`);
		assertOk(res, 'GET /tag/:id');

		res = http.get(`${BASE_URL}/tags/${SAMPLE_POST_ID}`);
		assertOk(res, 'GET /tags/:postId');
	});

	group('Bookmarks', () => {
		const res = http.get(`${BASE_URL}/bookmarks/${SAMPLE_USER_ID}`);
		assertOk(res, 'GET /bookmarks/:userId');
	});

	group('Reputation', () => {
		const res = http.get(`${BASE_URL}/reputations/${SAMPLE_USER_ID}`);
		assertOk(res, 'GET /reputations/:userId');
	});

	group('CodeSnippets', () => {
		let res = http.get(`${BASE_URL}/code-snippets/${SAMPLE_POST_ID}`);
		assertOk(res, 'GET /code-snippets/:postId');

		res = http.get(`${BASE_URL}/code-snippet/${SAMPLE_SNIPPET_ID}`);
		assertOk(res, 'GET /code-snippet/:id');
	});

	group('PostSolution', () => {
		const res = http.get(`${BASE_URL}/posts/${SAMPLE_POST_ID}/solution`);
		assertOk(res, 'GET /posts/:postId/solution');
	});

	sleep(1);
}

export function handleSummary(data) {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
	return {
		[`k6/reports/report-${timestamp}.html`]: htmlReport(data),
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
	};
}
