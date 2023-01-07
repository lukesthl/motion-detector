<script lang="ts">
  import { DoubleBounce } from "svelte-loading-spinners";
  import colors from "tailwindcss/colors";
  import { DiscoveryService } from "../service/discovery.service";
  import { ApplicationStore } from "../stores/application.store";

  let loading = false;
  let connectionType: "auto" | "manual" = "auto";
  let serverUrl: string | undefined;
  let manualIp: string | undefined;
  let error: string | undefined;
  const discoveryService = new DiscoveryService({
    port: 4001,

    
  });

  const connectManual = async () => {
    loading = true;
    if (manualIp) {
      const response = await discoveryService.connect(manualIp);
      if ("serverUrl" in response) {
        serverUrl = response.serverUrl;
        await ApplicationStore.saveConfig({ serverUrl });
        location.href = "/app";
        error = undefined;
      } else {
        error = response.error;
      }
    } else {
      error = "Server-IP is required.";
    }
    if (error) {
      console.error(error);
    }
    loading = false;
  };
</script>

<div class="max-w-4xl mx-auto h-full md:py-16 flex items-center">
  <div class="w-full p-16 rounded-lg bg-white">
    <div class="flex justify-center flex-wrap">
      <h1 class="text-4xl font-semibold">Setup Motion Detector</h1>
      <p class="text-zinc-500/80 mt-4 text-center">
        Connect the app with the raspberrypi server. In the app you can
        customize the actions, which will be triggered by the motion sensor.
      </p>
      <div class="mt-4 flex justify-center flex-wrap">
        {#if loading}
          <div class="text-center space-y-2">
            <div class="flex justify-center">
              <DoubleBounce size="72" color={colors.sky[500]} unit="px" />
            </div>
            <p class="text-sky-400 block">searching for devices...</p>
          </div>
        {:else if connectionType === "auto"}
          <button
            class="bg-sky-500 px-5 py-3 rounded-md text-white inline-flex text-lg"
            on:click={async () => {
              loading = true;
              serverUrl = await discoveryService.discover();
              if (serverUrl) {
                await ApplicationStore.saveConfig({ serverUrl });
                location.href = "/app";
              }
              loading = false;
            }}
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            Search for Device</button
          >
          <button
            class="mt-4 w-full text-zinc-400 underline"
            on:click={() => (connectionType = "manual")}>Manual Setup</button
          >
        {:else}
          <form
            on:submit|preventDefault={connectManual}
            class="flex flex-wrap justify-center"
          >
            <input
              bind:value={manualIp}
              placeholder="Server-IP (e.g.: 192.168.178.40)"
              class="px-3 py-2 rounded-l-md border-zinc-200 border-[1.5px] focus:outline-none w-64"
            />
            <button
              class="bg-sky-500 px-5 py-3 rounded-r-md text-white inline-flex text-lg"
              on:click={connectManual}
            >
              Connect</button
            >
            {#if error}
              <p class="w-full mt-2 text-center text-sm text-red-500">
                {error}
              </p>
            {/if}
            <button
              class="mt-4 w-full text-zinc-400 underline"
              on:click={() => (connectionType = "auto")}>Back</button
            >
          </form>{/if}
      </div>
    </div>
  </div>
</div>
