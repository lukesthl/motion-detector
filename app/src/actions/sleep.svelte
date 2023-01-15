<script lang="ts">
  import { onMount } from "svelte";
  import Timepicker from "../lib/timepicker.svelte";
  import { SettingsService } from "../settings/settings.service";
  import { actionLoading } from "./action.store";

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
