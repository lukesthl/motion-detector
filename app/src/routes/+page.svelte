<script>
  import Setup from "$lib/setup.svelte";

  import { ApplicationStore } from "../stores/application.store";
  import { onMount } from "svelte";

  onMount(async () => {
    await ApplicationStore.init();
    const serverUrl = ApplicationStore.serverUrl;
    if (serverUrl) {
      location.href = "/app";
    }
  });
</script>

<Setup />
