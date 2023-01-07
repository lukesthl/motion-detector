<script lang="ts">
  import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Switch,
  } from "@rgossiaux/svelte-headlessui";
  import { ActionType, type IAction } from "../../interfaces/action";
  import { ActionsService } from "../../service/actions.service";
  import {
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/api/notification";

  function classNames(
    ...classes: (false | null | undefined | string)[]
  ): string {
    return classes.filter(Boolean).join(" ");
  }

  export let onClose: () => void;
  export let onSave: () => void;

  export let action: IAction = {
    id: null,
    active: true,
    name: "",
    type: ActionType.NOTIFICATION,
    settings: { title: "" },
  };

  const capitalizeFirstLetter = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const saveAction = async (): Promise<void> => {
    await ActionsService.saveAction(action);
    if(action.type === ActionType.NOTIFICATION && !await isPermissionGranted()){
    await requestPermission();
    }
    onSave();
  };

  const deleteAction = async (): Promise<void> => {
   if(action.id){await ActionsService.deleteAction(action.id);

    
   }
    onSave();
  };
</script>

<div
  class="fixed inset-0 overflow-hidden"
  aria-labelledby="slide-over-title"
  role="dialog"
  aria-modal="true"
>
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute inset-0" aria-hidden="true">
      <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
        <!--
            Slide-over panel, show/hide based on slide-over state.
  
            Entering: "transform transition ease-in-out duration-500 sm:duration-700"
              From: "translate-x-full"
              To: "translate-x-0"
            Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
              From: "translate-x-0"
              To: "translate-x-full"
          -->
        <div class="w-screen max-w-2xl">
          <form
            class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll"
          >
            <div class="flex-1">
              <div class="px-4 py-6 bg-gray-50 sm:px-6">
                <div class="flex items-start justify-between space-x-3">
                  <div class="space-y-1">
                    <h2
                      class="text-lg font-medium text-gray-900"
                      id="slide-over-title"
                    >
                      New Actions
                    </h2>
                    <p class="text-sm text-gray-500">
                      Create your custom action which will be triggered by the
                      motion sensor.
                    </p>
                  </div>
                  <div class="h-7 flex items-center">
                    <button
                      type="button"
                      class="text-gray-400 hover:text-gray-500"
                      on:click={onClose}
                    >
                      <span class="sr-only">Close panel</span>
                      <!-- Heroicon name: outline/x -->
                      <svg
                        class="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200"
              >
                <div
                  class="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 items-center sm:gap-4 sm:px-6 sm:py-5"
                >
                  <div>
                    <label
                      for="project-name"
                      class="block text-sm font-medium text-gray-900 sm:mt-px"
                    >
                      Active
                    </label>
                  </div>
                  <div class="sm:col-span-2">
                    <Switch
                      checked={action.active}
                      on:change={(e) => (action.active = e.detail)}
                      class="relative inline-flex items-center rounded-full h-6 w-11 {action.active
                        ? 'switch bg-gray-600 mt-2'
                        : 'switch bg-gray-300 mt-2'}"
                    >
                      <span
                        class="inline-block w-4 h-4 bg-white rounded-full {action.active
                          ? 'translate-x-6'
                          : 'translate-x-1'}"
                      />
                    </Switch>
                  </div>
                </div>
                <div
                  class="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5"
                >
                  <div>
                    <label
                      for="project-name"
                      class="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                    >
                      Action Name
                    </label>
                  </div>
                  <div class="sm:col-span-2">
                    <input
                      type="text"
                      name="project-name"
                      id="project-name"
                      class="block w-full shadow-sm sm:text-sm focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md"
                      bind:value={action.name}
                    />
                  </div>
                </div>
                <div
                  class="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5"
                >
                  <div>
                    <label
                      for="project-name"
                      class="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                    >
                      Type
                    </label>
                  </div>
                  <div class="sm:col-span-2">
                    <Listbox
                      value={action.type}
                      on:change={(event) => {
                        action.type = event.detail;
                        if (action.type === ActionType.YEELIGHT) {
                          action.settings = {
                            bulbIp: "",
                            color: "",
                          };
                        } else if (action.type === ActionType.NOTIFICATION) {
                          action.settings = {
                            title: "",
                          };
                        } else if (action.type === ActionType.WEBHOOK) {
                          action.settings = {
                            url: "",
                          };
                        }
                      }}
                    >
                      <div class="relative">
                        <span class="inline-block w-full rounded-md shadow-sm">
                          <ListboxButton
                            class="relative w-full py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                          >
                            <span class="block truncate"
                              >{capitalizeFirstLetter(
                                action.type.toLowerCase()
                              )}</span
                            >
                            <span
                              class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                            >
                              <svg
                                class="w-5 h-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </span>
                          </ListboxButton>
                        </span>
                        <div
                          class="absolute w-full mt-1 bg-white rounded-md shadow-lg"
                        >
                          <ListboxOptions
                            class="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5"
                          >
                            {#each Object.values(ActionType) as name (name)}
                              <ListboxOption
                                value={name}
                                class={({ active }) => {
                                  return classNames(
                                    "relative py-2 pl-3 cursor-default select-none pr-9 focus:outline-none",
                                    active
                                      ? "text-white bg-gray-600"
                                      : "text-gray-900"
                                  );
                                }}
                                let:active
                                let:selected
                              >
                                <span
                                  class={classNames(
                                    "block truncate",
                                    selected ? "font-semibold" : "font-normal"
                                  )}
                                >
                                  {capitalizeFirstLetter(name.toLowerCase())}
                                </span>
                                {#if selected}
                                  <span
                                    class={classNames(
                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                      active ? "text-white" : "text-indigo-600"
                                    )}
                                  >
                                    <svg
                                      class="w-5 h-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                {/if}
                              </ListboxOption>
                            {/each}
                          </ListboxOptions>
                        </div>
                      </div>
                    </Listbox>
                  </div>
                </div>
                {#if action.type === ActionType.YEELIGHT}
                  <div
                    class="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5"
                  >
                    <div>
                      <label
                        for="project-name"
                        class="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                      >
                        Bulp IP
                      </label>
                    </div>
                    <div class="sm:col-span-2">
                      <input
                        type="text"
                        name="project-name"
                        id="project-name"
                        class="block w-full shadow-sm sm:text-sm focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md"
                        bind:value={action.settings.bulbIp}
                      />
                    </div>
                  </div>
                  <div
                    class="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5"
                  >
                    <div>
                      <label
                        for="project-name"
                        class="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                      >
                        Color
                      </label>
                    </div>
                    <div class="sm:col-span-2">
                      <input
                        type="text"
                        name="project-name"
                        id="project-name"
                        class="block w-full shadow-sm sm:text-sm focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md"
                        bind:value={action.settings.color}
                      />
                    </div>
                  </div>
                {:else if action.type === ActionType.NOTIFICATION}
                  <div
                    class="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5"
                  >
                    <div>
                      <label
                        for="project-name"
                        class="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                      >
                        Message
                      </label>
                    </div>
                    <div class="sm:col-span-2">
                      <input
                        type="text"
                        name="project-name"
                        id="project-name"
                        class="block w-full shadow-sm sm:text-sm focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md"
                        bind:value={action.settings.title}
                      />
                    </div>
                  </div>
                {:else}
                  <div
                    class="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5"
                  >
                    <div>
                      <label
                        for="project-name"
                        class="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                      >
                        URL
                      </label>
                    </div>
                    <div class="sm:col-span-2">
                      <input
                        type="text"
                        name="project-name"
                        id="project-name"
                        class="block w-full shadow-sm sm:text-sm focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md"
                        bind:value={action.settings.url}
                      />
                    </div>
                  </div>
                {/if}
              </div>
            </div>
            <div
              class="flex-shrink-0 px-4 flex justify-between border-t border-gray-200 py-5 sm:px-6"
            >
              {#if action.id}
                <button
                  type="button"
                  class="bg-red-200 py-2 px-4 border text-red-500 hover:bg-red-300/80 border-red-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  on:click={deleteAction}>Delete Action</button
                >
              {/if}

              <div
                class="space-x-3 flex {!action.id ? 'w-full' : ''} justify-end"
              >
                <button
                  type="button"
                  class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  on:click={onClose}>Cancel</button
                >
                <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  on:click={saveAction}
                  >{action.id ? "Update" : "Create"}</button
                >
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
