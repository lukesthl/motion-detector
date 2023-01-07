<script lang="ts">
  import { Switch } from "@rgossiaux/svelte-headlessui";
  import type { IAction } from "../../interfaces/action";
  import { ActionsService } from "../../service/actions.service";
  import { actionLoading } from "../../stores/action.store";

  const props = $$props;
  const action = props as IAction;
  const saveAction = async (): Promise<void> => {
    actionLoading.update(() => true);
    await ActionsService.saveAction(action);
    setTimeout(() => {
      actionLoading.update(() => false);
    }, 1000);
  };
</script>

<Switch
  checked={action.active}
  on:change={(e) => {
    action.active = e.detail;
    saveAction();
  }}
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
