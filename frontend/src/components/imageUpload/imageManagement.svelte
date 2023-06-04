<script>
  import { onMount } from "svelte";

    /**
   * @type {string}
   */
    export let target;
    export let socket;
    
    export function send(userID) {
        return new Promise( async (resolve, reject) => {
            const fd = new FormData();
            queuedImagesArray.forEach(file => {
                fd.append("files", file);
            });

            const response = await fetch(target + "/images", {
                method: "POST",
                credentials: "include",
                body: fd
            });

            if (response.status === 200) {
                queuedImagesArray = [];
                setTimeout(() => getImages(), 500);

                if (target.includes("profile") && userID) {
                    deleteArray.forEach(image => {
                        socket.emit("delete image", {image: image, userID: userID})
                    });
                } else {
                    const [brand, name, size] = target.split("/").slice(-3);
                    deleteArray.forEach(image => {
                        socket.emit("delete image", {image: image, brand, name, size})
                    });
                }
                

                resolve();
            } else {
                reject();
            }
        })
        
    }

    let queuedImagesArray = [];
    let imageInput;
    let serverImageArray = [];
    let deleteArray =[];

    function getImages() {
        if (!target) {
            console.log("target not set")
            return
        }

        fetch(target + "/images", {credentials: "include"})
            .then((response) => response.json())
            .then((result) => serverImageArray = result);
    }

    // Queued in frontend images

    function onChange() {
        const files = imageInput;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                queuedImagesArray = [ ...queuedImagesArray, files[i] ];
            }
            imageInput = null;
        }      
    }

    function deleteQueuedImage(index) {
        queuedImagesArray = [...queuedImagesArray.slice(0, index), ...queuedImagesArray.slice(index + 1)]
    }

    async function loadImage(file) {
        const response = await fetch(target + "/images/" + file, {
            credentials: "include"
        });

        const image = await response.blob();

        return URL.createObjectURL(image);
    }

    function deleteServerImage(index) {
        const imageToBeDeleted = serverImageArray[index];
        deleteArray = [...deleteArray, imageToBeDeleted]
        serverImageArray = [...serverImageArray.slice(0, index), ...serverImageArray.slice(index + 1)]
    }

    socket.on("deleted image", (data) => {
        serverImageArray = serverImageArray.filter(image => image !== data.image);
    });

    onMount(() => {
        getImages();
    })

</script>

<div class="header">
    <h2>Images</h2>
    <div class="server-messages"></div>
</div>

<input bind:files={imageInput} on:change={onChange} type="file" accept="image/png, image/jpg, image/jpeg" multiple>

<form id="queued-form">
    <div class="header">
        <h3>Queued</h3>
    </div>
    <div class="queued-div">
        {#each  queuedImagesArray as image, index }
            <div class="image">
                <img src="{URL.createObjectURL(image)}" alt="{image.name}">
                <span on:click={() => deleteQueuedImage(index)}>&times;</span>
            </div>
            <div>{queuedImagesArray}</div>
        {/each}
    </div>
</form>

<form id="saved-form">
    <div class="header">
        <h2>Saved on server</h2>
    </div>
    <div class="saved-div">
        {#each serverImageArray as image, index }
            <div class="image">
                {#await loadImage(image)}
                    loading
                {:then url} 
                    <img src={url} alt="">
                {:catch error}
                    system error: {error}
                {/await}
                <span on:click={() => deleteServerImage(index)}>&times;</span>
            </div>
            <div>{queuedImagesArray}</div>
        {/each}
    </div>
</form>


