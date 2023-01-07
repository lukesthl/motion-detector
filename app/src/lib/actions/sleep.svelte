<script lang="ts">
  import { SettingsService } from "../../service/settings.service";
  import { onMount } from "svelte";
  import Container from "../header.svelte";
  import Checkicon from "../icons/checkicon.svelte";
  import Refreshicon from "../icons/refreshicon.svelte";
  import Timepicker from "../timepicker.svelte";
  import { actionLoading } from "../../stores/action.store";

  let sleepFrom = new Date();
  let sleepTo = new Date();

  onMount(async () => {
    const settings = await SettingsService.getSettings();
    if (settings.sleepFrom) {
      sleepFrom = new Date(settings.sleepFrom);
    }
    if (settings.sleepTo) {
      sleepTo = new Date(settings.sleepTo);
    }
  });

  const saveSettings = async (): Promise<void> => {
    actionLoading.update(() => true);
    await SettingsService.saveSettings({
      sleepFrom: sleepFrom.valueOf(),
      sleepTo: sleepTo.valueOf(),
    });
    // API is too fast..
    setTimeout(() => {
      actionLoading.update(() => false);
    }, 1000);
  };
</script>

<div class="flex items-center">
  <p class="font-medium mr-2">Action Sleep:</p>

  <div class="flex items-center space-x-2">
    <Timepicker
      value={sleepFrom}
      onChange={(date) => {
        sleepFrom = date;
        saveSettings();
      }}
    />
    <div class="text-gray-400">-</div>
    <Timepicker
      value={sleepTo}
      onChange={(date) => {
        sleepTo = date;
        saveSettings();
      }}
    />
  </div>
</div>
