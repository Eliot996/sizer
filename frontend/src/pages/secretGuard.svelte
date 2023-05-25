<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { USER } from '../store/globalsStore.js';
  
    const navigate = useNavigate();
    const location = useLocation();
  
    $: if (!$USER) {
      navigate("/", {
        state: { from: $location.pathname },
        replace: true,
      });
    }
  </script>
  
  {#if $USER}
    <slot />
  {/if}
  