<script lang="ts">
  import { onMount, type ComponentProps } from "svelte";
  import Container from "../lib/header.svelte";
  import Checkicon from "../icons/checkicon.svelte";
  import Plusicon from "../icons/plusicon.svelte";
  import Refreshicon from "../icons/refreshicon.svelte";
  import EditModal from "./editmodal.svelte";
  import Editbutton from "./editbutton.svelte";
  import Sleep from "./sleep.svelte";
  import Statusswitch from "./statusswitch.svelte";
  import type { IAction } from "./action";
  import Playicon from "../icons/playicon.svelte";
  import { ActionsService } from "./actions.service";
  import { actionLoading } from "./action.store";
  import Table from "../lib/table/table.svelte";

  let loading = false;
  let showCreateModal = false;
  let selectedAction: IAction | undefined;
  actionLoading.subscribe((value) => {
    loading = value;
  });

  let actions: IAction[] = [];

  const columns: ComponentProps<Table>["columns"] = [
    {
      title: "Status",
      component: Statusswitch,
    },
    {
      title: "Name",
      render: (source: IAction) => source.name,
    },
    {
      title: "Type",
      render: (source: IAction) =>
        source.type.toLowerCase().charAt(0).toUpperCase() +
        source.type.toLowerCase().slice(1),
    },
    {
      title: "Edit",
      component: Editbutton,
      onClick: (action) => {
        selectedAction = action;
        showCreateModal = true;
      },
    },
  ];

  const loadActions = async (): Promise<void> => {
    actions = await ActionsService.getActions();
  };

  onMount(async () => {
    loadActions();
  });
</script>

<Container>
  <svelte:fragment slot="title">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <h1>Configure Actions</h1>
        <div
          class="{loading
            ? 'text-blue-600 animate-spin bg-blue-200'
            : 'text-green-600 bg-green-200'} p-1 rounded-full"
        >
          {#if loading}
            <Refreshicon className="w-4 h-4 stroke-2" />
          {:else}
            <Checkicon className="w-4 h-4 stroke-2" />
          {/if}
        </div>
      </div>
      <button
        class="text-blue-600 flex space-x-1 items-center bg-blue-200 rounded-full px-2 py-1"
        on:click={() => {
          actionLoading.update(() => true);
          ActionsService.manualTrigger();
          setTimeout(() => {
            actionLoading.update(() => false);
          }, 1000);
        }}
      >
        <div>
          <Playicon className="w-4 h-4 stroke-2" />
        </div>
        <p class="font-normal tracking-tighter text-sm">Manual Trigger</p>
      </button>
    </div>
  </svelte:fragment>
  <Sleep />
  <div class="mt-8">
    <Table data={actions} {columns} style="transparent" />
    <button
      class="inline-flex items-center bg-white px-3 rounded-md border border-gray-200 py-2 font-medium"
      on:click={() => (showCreateModal = true)}
      ><Plusicon className="w-4 h-4 stroke-2 mr-1" /> Add Action</button
    >
  </div>
</Container>
{#if showCreateModal}
  <EditModal
    onClose={() => {
      showCreateModal = false;
      selectedAction = undefined;
    }}
    onSave={() => {
      actionLoading.update(() => true);
      showCreateModal = false;
      selectedAction = undefined;
      loadActions();
      setTimeout(() => {
        actionLoading.update(() => false);
      }, 1000);
    }}
    action={selectedAction}
  />
{/if}
