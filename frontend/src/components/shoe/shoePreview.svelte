<script>
    import { BASE_URL } from "../../store/globalsStore";
    import { useNavigate, useLocation } from "svelte-navigator";

    const navigate = useNavigate();
    const location = useLocation();


    export let brand, name, size, image;

    async function loadImage(file) {
        if (!file) {
            return;
        }

        const response = await fetch(`${$BASE_URL}/shoes/${brand}/${name}/${size}/images/${file}`, {
            credentials: "include"
        });

        const image = await response.blob();

        return URL.createObjectURL(image);
    }

    function redirect() {
        navigate(`/shoes/${brand}/${name}/${size}`, {
                state: { from: $location.pathname },
                replace: true,
            });
    }
</script>

<div class="preview" on:click={redirect}>
    {#await loadImage(image)}
        loading
    {:then url} 
        <img src={url} alt="">
    {:catch error}
        system error: {error}
    {/await}
    <h3>{brand} {name}</h3>
    <h4>{size}</h4>
</div>


<style>
.preview {
    padding: 1em;
    margin: 5px;
    width: 25vw;
    height: 25vw;
    background-color: black;
    border-radius: 10px;
    border-width: 3px;
    border-color: gray;
    border-style: solid;
}

.preview:hover {
    border-color: darkgray;
    cursor: pointer;
}

.preview img {
    width: 100%;
    border-radius: 10px;
}
</style>