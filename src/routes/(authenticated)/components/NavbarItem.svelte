<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	export let label: string;

	let clazz: string = '';

	export { clazz as class };

	$: aClass =
		`py-2 px-3 rounded-md font-medium ${
			$page.url.pathname == href ? 'bg-gray-900' : 'hover:bg-gray-600'
		} ` + clazz;
</script>

<a class={aClass} {href}>{label}</a>
