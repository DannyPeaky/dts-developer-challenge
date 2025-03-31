<script lang="ts">
	import { writable } from 'svelte/store';
	import type { PageProps } from './$types';
	import TaskComponent from '../components/task_component.svelte';

	// Get tasks from the page load function
	let { data }: PageProps = $props();

	// Define a writable store to hold the todo list
	const tasks = writable<Task[]>(data.tasks);

	// Local state for the new todo input
	let newTask = $state(generateEmptyTask());

	function generateEmptyTask(): Task {
		return {
			text: '',
			description: '',
			status: 'pending',
			due: new Date().toDateString()
		};
	}

	function addTask() {
		if (!newTask.text.trim()) return alert('Please enter a task');
		if (!newTask.due) return alert('Please select a due date');
		newTask.id = Date.now(); // Simple unique ID based on timestamp

		tasks.update((currentTasks) => {
			// Send the new to the server
			fetch('/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newTask)
			}).then((response) => {
				if (!response.ok) {
					// Rollback the optimistic update
					currentTasks = currentTasks.filter((task) => task.id !== newTask.id);
					tasks.set(currentTasks);

					return alert('Failed to add task');
				}
			});

			// Optimistically update the local store
			const updatedTasks = [...currentTasks, newTask];
			updatedTasks.sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
			return updatedTasks;
		});
		newTask = generateEmptyTask(); // Reset the input field
	}

	function updateStatus(index: number) {
		tasks.update((currentTasks) => {
			const updatedTasks = [...currentTasks];
			const taskToUpdate = updatedTasks[index];

			taskToUpdate.status = taskToUpdate.status === 'completed' ? 'pending' : 'completed';

			// Send the update request to the server
			fetch(`/tasks/${taskToUpdate.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(taskToUpdate)
			}).then((response) => {
				if (!response.ok) {
					// Rollback the optimistic update
					tasks.set(currentTasks);

					return alert('Failed to update task status');
				}
			});

			return updatedTasks;
		});
	}

	function removeTask(index: number) {
		tasks.update((currentTasks) => {
			const taskToRemove = currentTasks[index];

			// Send the delete request to the server
			fetch(`/tasks/${taskToRemove.id}`, { method: 'DELETE' }).then((response) => {
				if (!response.ok) {
					// Rollback the optimistic update
					tasks.set(currentTasks);

					return alert('Failed to remove task');
				}
			});

			// Optimistically update the local store
			return currentTasks.filter((_, i) => i !== index);
		});
	}
</script>

<h1>Tasks</h1>
<form onsubmit={addTask}>
	<input type="text" bind:value={newTask.text} placeholder="Add a new task" />
	<input type="text" bind:value={newTask.description} placeholder="Description" />
	<select bind:value={newTask.status}>
		<option value="pending">Pending</option>
		<option value="completed">Completed</option>
	</select>
	<input type="date" bind:value={newTask.due} placeholder="Due date" />
	<button type="submit">Add</button>
</form>

<ul>
	{#each $tasks as task, index}
		<TaskComponent
			{task}
			updateStatus={() => updateStatus(index)}
			removeTask={() => removeTask(index)}
		/>
	{/each}
</ul>

<style lang="scss">
	h1 {
		text-align: center;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 20px;

		input,
		select,
		button {
			margin: 5px;
			padding: 10px;
			width: 100%;
		}
	}

	ul {
		list-style: none;
		padding: 0;
	}
</style>
