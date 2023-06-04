<script>
    import SecretGuard from "./secretGuard.svelte";
    import { BASE_URL } from "../store/globalsStore.js";
    import ImageManagement from "../components/imageUpload/imageManagement.svelte";

    let sendImages;

    import io from "socket.io-client";
    let socket = io($BASE_URL);

    export let brand, name, size;
</script>

    <SecretGuard>

        <h1>{brand} {name}</h1>
        <h3>{size}</h3>

        <button on:click={sendImages}>Save</button>

        <ImageManagement target={`${$BASE_URL}/shoes/${brand}/${name}/${size}`} bind:socket={socket} bind:send={sendImages}/>

    </SecretGuard>