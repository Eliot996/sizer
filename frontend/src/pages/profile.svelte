<script>
    import { Route } from "svelte-navigator";
    import SecretGuard from "./secretGuard.svelte";
    export let path;

    import { BASE_URL } from "../store/globalsStore.js";
    import ImageManagement from "../components/imageUpload/imageManagement.svelte";
    import toast, { Toaster } from 'svelte-french-toast';

    let sendImages;

    import io from "socket.io-client";
    let socket = io($BASE_URL);

    let profile = {};
    let password1, password2, passwordOld, email;

    async function loadProfileData() {
        const response = await fetch($BASE_URL + "/profile", {credentials: "include"})
        const result = await response.json();

        profile = result;

        return profile
    }

    async function save() {
        sendImages();

        const updateObject = {};

        if (email && email !== profile.email) {
            updateObject.email = email;
        }

        if (password1 === password2 && passwordOld) {
            updateObject.updatedPassword = password1;
            updateObject.passwordOld = passwordOld;
        }

        const response = await fetch($BASE_URL + "/profile", {
            method: "PATCH",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(updateObject)
        });

        const results = await response.json();

        if (results.password) {
            if (results.password = true) {
                toast.success("Password changed")
            } else {
                toast.error("Password was not right, or they didn't match")
            }
        }

        if (results.email) {
            toast.success("Email changed");
        }

        loadProfileData();
    }
</script>

<Route {path} let:params let:location let:navigate>
    <SecretGuard>
        <slot {params} {location} {navigate} />

        <Toaster />

        <h1>Profile</h1>

        {#await loadProfileData()}
            <h3>loading profile data</h3>
        {/await}

        <button class="button" on:click={save}>Save</button>
        <br>
        <br>

        <label for="email">Email:</label>
        <input bind:value={email} type="text" name="email" id="email" placeholder={profile.email}>
        <br>
        <br>

        <label for="password1">New password?</label><br>
        <input bind:value={password1} type="password" name="password1" id="password1" placeholder="Enter new password"><br>
        <input bind:value={password2} type="password" name="password2" id="password2" placeholder="Enter new password">
        <br>

        <label for="size">Enter your old password, to change password:</label><br>
        <input bind:value={passwordOld} type="password" name="size" id="size">
        <br>
        <br>

        <ImageManagement target={`${$BASE_URL}/profile/images`} bind:socket={socket} bind:send={sendImages}/>

    </SecretGuard>
</Route>