<script>
  import Setup from "../setup/setup.svelte";

  import { ApplicationStore } from "../settings/application.store";
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
