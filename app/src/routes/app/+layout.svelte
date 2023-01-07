<script lang="ts">
  import { onMount } from "svelte";
  import Connectionstatus from "../../lib/connectionstatus.svelte";
  import Actionicon from "../../lib/icons/actionicon.svelte";
  import Dashboardicon from "../../lib/icons/dashboardicon.svelte";
  import Settingsicon from "../../lib/icons/settingsicon.svelte";
  import { ApplicationStore } from "../../stores/application.store";
  import { page } from "$app/stores";
  import Activityicon from "../../lib/icons/activityicon.svelte";

  const navigation = [
    { name: "Actions", icon: Actionicon, href: "/app/actions" },
    {
      name: "Dashboard",
      icon: Dashboardicon,
      href: "/app/dashboard",
    },
    {
      name: "Activity Logs",
      icon: Activityicon,
      href: "/app/activitylogs",
    },
    {
      name: "Settings",
      icon: Settingsicon,
      href: "/app/settings",
    },
  ];

  let loaded = false;
  $: path = $page.url.pathname;
  onMount(async () => {
    await ApplicationStore.init();
    const serverUrl = ApplicationStore.serverUrl;
    if (!serverUrl) {
      location.href = "/";
    }
    loaded = true;
  });
</script>

{#if loaded}
  <div class="flex h-full">
    <div
      class="flex-none flex flex-col min-h-0 border-r border-gray-200 bg-white"
    >
      <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div class="flex items-center flex-shrink-0 px-4">
          <h1 class="font-semibold text-xl"><a href="/">Motion Detector App</a></h1>
        </div>
        <nav class="mt-5 flex-1 px-2 bg-white space-y-1" aria-label="Sidebar">
          {#each navigation as navItem}
            <a
              href={navItem.href}
              class={navItem.href === path
                ? "bg-gray-100 text-gray-900 hover:text-gray-900 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md"}
            >
              <svelte:component
                this={navItem.icon}
                className=" {navItem.href === path
                  ? 'text-gray-600'
                  : 'text-gray-400 group-hover:text-gray-500'} mr-3 flex-shrink-0 h-6 w-6"
              />

              <span class="flex-1"> {navItem.name} </span>
            </a>
          {/each}
        </nav>
      </div>
      <div class="flex border-t border-gray-200 p-4">
        <Connectionstatus />
      </div>
    </div>

    <div class="flex-auto overflow-y-auto">
      <slot />
    </div>
  </div>
{/if}
