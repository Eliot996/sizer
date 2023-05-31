<script>
    import { Route } from "svelte-navigator";
    import SecretGuard from "./secretGuard.svelte";
    export let path;
  
    import ImageUpload from "../components/imageUpload/imageUpload.svelte";
    import { BASE_URL} from '../store/globalsStore.js';

    let brand, name, size, sendImages;

    function save() {
        fetch($BASE_URL + "/shoes", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({brand, name, size})
        })
    }
</script>


<Route {path} let:params let:location let:navigate>
    <SecretGuard>
        <slot {params} {location} {navigate} />

        <h1>Create or upload image for a shoe</h1>

        <button class="button" on:click={save}>Save</button>
        <br>
        <br>

        <label for="brand">Enter brandname for the shoe:</label>
        <input bind:value={brand} type="text" name="brand" id="brand" placeholder="Nike?">
        <br>

        <label for="name">Enter name for the shoe:</label>
        <input bind:value={name} type="text" name="name" id="name" placeholder="Airforce">
        <br>

        <label for="size">Enter the size:</label>
        <input bind:value={size} type="number" name="size" id="size" placeholder=42>
        <br>

        <ImageUpload target={`${$BASE_URL}/${brand}/${name}/${size}`} bind:send={sendImages} />

    </SecretGuard>
</Route>