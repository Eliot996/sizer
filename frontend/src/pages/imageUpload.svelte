<script>
    import {BASE_URL} from "../store/globalsStore.js";

    function send() {
        const fd = new FormData();
        fd.append("file", imageInput.files[0]);

        fetch($BASE_URL + "/upload", {
            method: "POST",
            body: fd
        })
    }

</script>


<h1>Image upload</h1>

<input id="image-input" name="image" type="file" accept="image/png, image/jpg, image/jpeg">
<label for="image"></label>

<button class="button" on:click="{send}">Send</button>