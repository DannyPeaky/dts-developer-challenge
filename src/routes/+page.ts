import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/tasks');
	if (!response.ok) {
		throw new Error('Failed to fetch tasks');
	}

	const tasks = await response.json();
	return { tasks };
};
