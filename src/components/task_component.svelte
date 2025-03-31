<script lang="ts">
	let { task, updateStatus, removeTask } = $props();
</script>

<li>
	<h2>{task.text}</h2>
	{#if task.description}
		<p>{task.description}</p>
	{/if}
	<p>Status: {task.status}</p>
	<p>Due: {task.due}</p>
	<input type="checkbox" checked={task.status === 'completed'} onchange={() => updateStatus()} />
	<button onclick={() => removeTask()}>Remove</button>
</li>

<style lang="scss">
	li {
		list-style: none;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	input[type='checkbox'] {
		margin-right: 0.5rem;
	}

	button {
		background-color: #ff4d4d;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 5px;
		cursor: pointer;

		&:hover {
			background-color: #ff1a1a;
		}
	}
</style>
