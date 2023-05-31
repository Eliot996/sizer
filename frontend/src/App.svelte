<script lang="ts">
  import { Router, Link, Route } from "svelte-navigator";
	import Secret from "./pages/secret.svelte";
  import Create from './pages/create.svelte';
  import Home from './pages/home.svelte';
  import CreateShoe from "./pages/createShoe.svelte";
  import EditShoes from "./pages/editShoes.svelte";
  import { BASE_URL, USER } from './store/globalsStore.js';

  export function logout() {
    fetch($BASE_URL + '/logout');
    $USER = undefined;
  }
</script>

<Router>
  <nav>
    <Link to="/" class="link-button">Home</Link>
    {#if !$USER}
    <Link to="/create-user" class="link-button">Create new user</Link>
    {/if}
    {#if $USER}
      <Link to="/secret" class="link-button">Secret</Link>
      <Link to="/create-shoe" class="link-button">Create shoe</Link>
      <span class="link-button" on:click={logout}>logout</span>
    {/if}
  </nav>
  <Route path="/">
    <div class="card">
      <Home />
    </div>
  </Route>
  <Route path="/create-user">
    <div class="card">
      <Create />
    </div>
  </Route>
  <Secret path="/secret" let:location />
  <CreateShoe path="/create-shoe"/>
  <Route path="/shoes/:brand/:name/:size" let:params>
    <EditShoes brand={params.brand} name={params.name} size={params.size} />
  </Route>
</Router>


