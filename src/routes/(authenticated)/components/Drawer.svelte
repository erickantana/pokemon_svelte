<script lang="ts">
	import DrawerItem from './DrawerItem.svelte';

	let showDrawer: boolean = false;
</script>

<!-- Icon Toggle -->
<div
	on:keypress={() => {}}
	class="inline-block md:hidden align-middle"
	on:click={() => (showDrawer = true)}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-6 h-6"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
		/>
	</svg>
</div>

<!-- Sidenav -->
<div
	class={`absolute p-4 z-20 top-0 bg-gray-800 h-screen w-60 transition-all duration-500 -left-60 ${
		showDrawer ? 'translate-x-60' : ''
	}`}
>
	<DrawerItem on:click={() => (showDrawer = false)} class="" href="/" label="Home" />
	<DrawerItem on:click={() => (showDrawer = false)} class="mt-2" href="/pokemon" label="Pokemon" />
	<DrawerItem
		on:click={() => (showDrawer = false)}
		class="mt-2"
		href="/pokemon-collections"
		label="Collection"
	/>
</div>

<!-- Dim -->
<div
	on:click={() => {
		showDrawer = false;
	}}
	on:keypress
	class={`z-10 left-0 w-full h-screen absolute top-0 bg-black transition-opacity duration-500 ${
		showDrawer ? 'opacity-50' : 'opacity-0 pointer-events-none'
	}`}
/>
