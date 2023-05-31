<script>
    /**
   * @type {string}
   */
    export let target;

    export function send() {
        console.log(target)
        return
        const fd = new FormData();
        queuedImagesArray.forEach(file => {
            fd.append("files", file);
        })

        fetch(target || "/upload", {
            method: "POST",
            body: fd
        })
    }

    let queuedImagesArray = [];
    let imageInput;

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

</script>

<div class="header">
    <h2>Images</h2>
    <div class="server-messages"></div>
</div>

<input bind:files={imageInput} on:change={onChange} type="file" accept="image/png, image/jpg, image/jpeg" multiple>

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

<form id="saved-form">
    <div class="header">
        <h2>Saved In server</h2>
        <button type="submit">Delete</button>
    </div>
    <div class="saved-div"></div>
</form>


