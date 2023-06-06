<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pokemon } from '../../../core/entities/pokemon';
	import container from '../../../core/container/index';
	import TYPES from '../../../core/container/types';
	import type { IPokemonRepository } from '../data/interface/pokemon_repository';
	import type { EvolutionMap } from '../../../core/entities/evolution_map';
	import type { EvolutionChain } from '../../../core/entities/evolution_chain';

    export let data;

    let pokemon: Pokemon | null;

    $: types = pokemon?.types;

    let evolutionMaps: EvolutionMap[] = [];

    function evolutionChainToEvolutionMaps(evolutionMaps: EvolutionMap[], evolutionChain: EvolutionChain): void {
        evolutionChain.evolveTo?.forEach((evolveTo) => {
            evolutionMaps.push({
                fromSpeciesUrl: evolutionChain.speciesUrl,
                toSpeciesUrl: evolveTo.speciesUrl
            });
            evolutionChainToEvolutionMaps(evolutionMaps, evolveTo);
        });
    }

    onMount(async () => {
        const repository = container.get<IPokemonRepository>(TYPES.PokemonRepository);
        pokemon = await repository.findById(data.name);
        const evolutionChain = pokemon?.evolutionChain;
        if (evolutionChain) {
            const evolutions: EvolutionMap[] = [];
            evolutionChainToEvolutionMaps(evolutions, evolutionChain);
            evolutionMaps = evolutions;
        }
    })
</script>

{#if pokemon}
    <div>{pokemon.name} {pokemon.id}</div>
    <img src={pokemon.sprites?.front_default} alt={pokemon.name} />
    {#each evolutionMaps as evolutionMap}
        <div>{evolutionMap.fromSpeciesUrl} -&gt; {evolutionMap.toSpeciesUrl}</div>
    {/each}
    {#if types}
        {#each types as type}
            <div>{type?.type?.name}</div>
        {/each}
    {/if}
    <div>{pokemon.height}</div>
    <div>{pokemon.weight}</div>
{/if}