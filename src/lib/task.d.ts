interface Task {
	id?: number;
	text: string;
	description?: string;
	status: 'completed' | 'pending';
	due: string;
}
