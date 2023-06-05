<script lang="ts">
	import type { Pokemon } from "../../../core/entities/pokemon";
	import type { IPokemonRepository } from "../data/interface/pokemon_repository";
	import type { Type } from "../../../core/entities/type";
	import { onMount } from "svelte";
	import container from "../../../core/container";
	import TYPES from "../../../core/container/types";

    export let pokemon: Pokemon | undefined;

    let types: (Type | null)[] | null | undefined;

    onMount(async () => {
        if (!pokemon?.name) return;

        const repository: IPokemonRepository = container.get<IPokemonRepository>(TYPES.PokemonRepository);
        types = (await repository.findById(pokemon.name))?.types;
    });
</script>

<button on:click>
    {#if pokemon}
        <div>{pokemon.name}</div>
        <img src={pokemon.image} alt={pokemon.name}>
        {#each types ?? [] as type}
            {#if type}
                {type.type?.name}
            {/if}
        {/each}
    {:else}
        <div>Unknown Pokemon</div>
    {/if}
</button>