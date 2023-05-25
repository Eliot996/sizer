<script>
    import { Route } from "svelte-navigator";
    import SecretGuard from "./secretGuard.svelte";
  
    import { BASE_URL} from '../store/globalsStore.js';

    async function getSecret() {
      const res = await fetch($BASE_URL + '/data', {credentials: 'include'});
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error('Request failed');
      }
    }

    export let path;
  </script>
  
  <Route {path} let:params let:location let:navigate>
    <SecretGuard>
      <slot {params} {location} {navigate} />
      <h1>The answer to life, the universe and everything is:</h1>
      {#await getSecret()}
        <p>...waiting</p>
      {:then answer}
        <p>{answer.secret}</p>
      {:catch error}
        <p style="color: red">{error.message}</p>
      {/await}
    </SecretGuard>
  </Route>
  