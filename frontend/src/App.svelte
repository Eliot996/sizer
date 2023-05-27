<script lang="ts">
  import { Router, Link, Route } from "svelte-navigator";
	import Secret from "./pages/secret.svelte";
  import Create from './pages/create.svelte';
  import Home from './pages/home.svelte';
  import ImageUpload from "./pages/imageUpload.svelte";
  import { BASE_URL, USER } from './store/globalsStore.js';

  export function logout() {
    fetch($BASE_URL + '/logout');
    $USER = undefined;
  }
</script>

<Router>
  <nav>
    <Link to="/" class="link-button">Home</Link>
    <Link to="/upload" class="link-button">Upload image</Link>
    {#if !$USER}
    <Link to="/create-user" class="link-button">Create new user</Link>
    {/if}
    {#if $USER}
      <Link to="/secret" class="link-button">Secret</Link>
      <span class="link-button" on:click={logout}>logout</span>
    {/if}
  </nav>
  <Route path="/">
    <div class="card">
      <Home />
    </div>
  </Route>
  <Route path="/upload">
    <div class="card">
      <ImageUpload />
    </div>
  </Route>
  <Route path="/create-user">
    <div class="card">
      <Create />
    </div>
  </Route>
  <Secret path="/secret" let:location />
</Router>


