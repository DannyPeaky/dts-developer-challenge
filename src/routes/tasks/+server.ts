import type { RequestHandler } from './$types';
import { Database } from '$lib/database';

export const GET: RequestHandler = () => {
	const client = Database.getClient();
	const tasks = client.query('SELECT * FROM tasks').all();

	return new Response(JSON.stringify(tasks), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const client = Database.getClient();
	const { text, description, status, due } = await request.json();

	client
		.prepare('INSERT INTO tasks (text, description, status, due) VALUES (?, ?, ?, ?)')
		.run(text, description, status, due);

	return new Response(JSON.stringify({ message: 'Task created successfully' }), {
		status: 201,
		headers: { 'Content-Type': 'application/json' }
	});
};
