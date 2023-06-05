<script>
    import SecretGuard from "./secretGuard.svelte";
    import { BASE_URL } from "../store/globalsStore.js";
    import ImageManagement from "../components/imageUpload/imageManagement.svelte";
    import toast, { Toaster } from 'svelte-french-toast';

    let sendImages;

    import io from "socket.io-client";
    let socket = io($BASE_URL);

    export let brand, name, size;
    let fit = "";

    function save() {
        toast.promise(sendImages(), {
                    loading: 'Saving changes',
                    success: 'Changes saved',
                    error: 'Could not save, try again later',
            });
    }

    function randomize() {
        const n = Math.random();

        if (n < 1/3) {
            fit = "It should fit";
        } else if (n < 2/3)  {
            fit = "It might be to big";
        } else {
            fit = "It might be to small"; 
        }
    }

</script>

    <SecretGuard>
        <Toaster />

        <h1>{brand} {name}</h1>
        <h3>{size}</h3>

        <button on:click={save}>Save</button><br><br>
        <button on:click={randomize}>Check size</button>
        <p>{fit}</p>

        <ImageManagement target={`${$BASE_URL}/shoes/${brand}/${name}/${size}`} bind:socket={socket} bind:send={sendImages}/>

    </SecretGuard>