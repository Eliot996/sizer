<script>
    import { afterUpdate, onMount } from "svelte";

    import { Route } from "svelte-navigator";
    import SecretGuard from "./secretGuard.svelte";
    export let path;

    import { BASE_URL} from '../store/globalsStore.js';
    import ShoePreview from "../components/shoe/shoePreview.svelte";

    let shoes;

    async function loadShoes() {
        const response = await fetch($BASE_URL + "/shoes", {credentials: "include"})
        const result = await response.json();

        shoes = result;

        return shoes;
    }

</script>

<Route {path} let:params let:location let:navigate>
    <SecretGuard>
        <slot {params} {location} {navigate} />

        <h1>Shoes</h1>

        <div class="shoes">
            {#await loadShoes()}
                loading shoes
            {:then shoes} 
                {#each shoes as shoe }
                    <ShoePreview brand={shoe.brand} name={shoe.name} size={shoe.size} image={shoe.imageName}/>
                {/each}
            {/await}
        </div>

    </SecretGuard>
</Route>


<style>

.shoes {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    width: 100vw;
}

</style>