<script lang="ts">
	export let label: string;
</script>

<button
	class="p-2 text-white font-medium bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-300 hover:drop-shadow-md"
	on:click
>
	{label}
</button>
