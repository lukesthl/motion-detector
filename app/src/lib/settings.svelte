<script lang="ts">
  import { SettingsService } from "../service/settings.service";
  import { ApplicationStore } from "../stores/application.store";
  import Header from "./header.svelte";
</script>

<Header>
  <svelte:fragment slot="title">Settings</svelte:fragment>
  <div class="bg-white border border-gray-200 overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">General</h3>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Server URL</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {ApplicationStore.serverUrl}
          </dd>
        </div>
        <div
          class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center"
        >
          <dt class="text-sm font-medium text-gray-500">Server Connection</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <button
              on:click={async () => {
                console.log("not implemented yet! :D");
                await SettingsService.deleteAppData().catch((error) =>
                  console.log(error)
                );
                ApplicationStore.reset().then(() => location.reload());
              }}
              class="bg-red-100 text-red-500 py-2 px-3 rounded-md font-medium"
              >Delete Appdata & Server Connection</button
            >
          </dd>
        </div>
      </dl>
    </div>
  </div>
</Header>
