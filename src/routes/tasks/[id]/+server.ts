import { Database } from '$lib/database';
import type { RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ request, params }) => {
	const client = Database.getClient();

	if (!params.id) {
		return new Response(JSON.stringify({ error: 'Task ID is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { status } = await request.json();
	if (!status) {
		return new Response(JSON.stringify({ error: 'Status is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	client.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, params.id);

	return new Response(JSON.stringify({ message: 'Task updated successfully' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};

export const DELETE: RequestHandler = async ({ params }) => {
	const client = Database.getClient();

	if (!params.id) {
		return new Response(JSON.stringify({ error: 'Task ID is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	client.prepare('DELETE FROM tasks WHERE id = ?').run(params.id);

	return new Response(JSON.stringify({ message: 'Task deleted successfully' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
