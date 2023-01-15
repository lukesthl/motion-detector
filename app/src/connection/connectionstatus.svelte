<script lang="ts">
  import { onMount } from "svelte";
  import { ApplicationStore } from "../settings/application.store";
  import { connectionStatus } from "./connection.store";

  const maxRetries = 20;
  let connectionRetries = 0;
  let intervalId: ReturnType<typeof setInterval> | undefined;
  let connectionStatusValue:
    | "disconnected"
    | "connected"
    | "waitingforconnection" = "waitingforconnection";
  const setupListener = () => {
    ApplicationStore.connection?.client.addEventListener("open", () => {
      connectionStatus.set("connected");

      if (intervalId) {
        console.log("clear interval");
        connectionRetries = 0;
        clearInterval(intervalId);
      }
    });
    ApplicationStore.connection?.client.addEventListener("close", () => {
      connectionStatus.set("disconnected");
      if (!intervalId) {
        intervalId = setInterval(() => {
          if (connectionRetries < maxRetries) {
            connectionRetries += 1;
            ApplicationStore.connection?.reconnect();
            setupListener();
          }
        }, 5000);
      }
    });
  };

  onMount(() => {
    setupListener();
  });

  connectionStatus.subscribe((value) => {
    connectionStatusValue = value;
  });
</script>

<div class="flex items-center">
  <button
    on:click={() => {
      if (connectionStatusValue === "disconnected") {
        ApplicationStore.connection?.reconnect();
        setupListener();
      } else {
        ApplicationStore.connection?.close();
        setupListener();
      }
    }}
    class="{connectionStatusValue === 'connected'
      ? 'bg-green-100'
      : 'bg-red-100'} rounded-full p-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="w-5 h-5 {connectionStatusValue === 'connected'
        ? 'text-green-600'
        : 'text-red-600'}"
    >
      <path
        d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"
      />
      <path
        d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"
      />
    </svg>
  </button>
  <div class="ml-3">
    <p class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
      {ApplicationStore.serverUrl?.replace("http://", "")}
    </p>
    <p
      class="text-xs font-medium {connectionStatusValue === 'connected'
        ? 'text-green-500'
        : 'text-red-500'} group-hover:text-gray-700"
    >
      {#if connectionStatusValue === "connected"}
        Connected
      {:else}
        Disconnected (Retries: {connectionRetries} / {maxRetries})
      {/if}
    </p>
  </div>
</div>
