<script>
    import {BASE_URL} from "../../store/globalsStore.js";

    export let target;

    export function send() {
        const fd = new FormData();
        queuedImagesArray.forEach(file => {
            fd.append("files", file);
        })

        fetch($BASE_URL + target || "/upload", {
            method: "POST",
            body: fd
        })
    }

    let queuedImagesArray = [];
    let imageInput;

    // Queued in frontend images

    $: {
        const files = imageInput;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                queuedImagesArray = [ ...queuedImagesArray, files[i] ];
            }
            imageInput = null;
        }      
    }

    function inputDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match("image")) continue
            
            if (queuedImagesArray.every(image => image.name !== files[i].name)) {
                queuedImagesArray = [ ...queuedImagesArray, files[i] ];
            }
        }
    }

    function deleteQueuedImage(index) {
        queuedImagesArray = [...queuedImagesArray.slice(0, index), ...queuedImagesArray.slice(index + 1)]
    }

</script>

<div class="header">
    <h2>Images</h2>
    <div class="server-messages"></div>
</div>

<div class="input-div" on:drop={inputDrop}>
    <p>Drag and drop images here or <span class="browse">browse</span></p>
    <input bind:files={imageInput} type="file" accept="image/png, image/jpg, image/jpeg" multiple>
</div>

<form id="saved-form">
    <div class="header">
        <h2>Saved In server</h2>
        <button type="submit">Delete</button>
    </div>
    <div class="saved-div"></div>
</form>

<form id="queued-form">
    <div class="header">
        <h3>Queued in Frontend</h3>
        <button type="submit">Upload</button>
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
