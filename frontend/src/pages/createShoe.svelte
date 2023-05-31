<script>
    import { Route } from "svelte-navigator";
    import SecretGuard from "./secretGuard.svelte";
    export let path;
  
    import ImageUpload from "../components/imageUpload/imageUpload.svelte";
    import { BASE_URL} from '../store/globalsStore.js';

    import toast, { Toaster } from 'svelte-french-toast';
    import { useNavigate, useLocation } from "svelte-navigator";

    const navigate = useNavigate();
    const location = useLocation();

    let brand, name, size, sendImages;

    async function save() {
        const response = await fetch($BASE_URL + "/shoes", {
            method: "POST",
            credentials: "include", 
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ brand: brand, name: name, size: size })
        });

        if (response.status !== 200) {
            toast.error("something went wrong in the fetch");
        } else {
            const result = await response.json();
            toast.success(result.message)

            await toast.promise(sendImages(), {
                    loading: 'Saving images',
                    success: 'Images saved',
                    error: 'Could not save, try again later',
            });
            
            navigate(`/shoes/${brand}/${name}/${size}`, {
                state: { from: $location.pathname },
                replace: true,
            });
        }
    }
</script>


<Route {path} let:params let:location let:navigate>
    <SecretGuard>
        <slot {params} {location} {navigate} />

        <Toaster />

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

        <ImageUpload target={`${$BASE_URL}/shoes/${brand}/${name}/${size}`} bind:send={sendImages} />
    </SecretGuard>
</Route>