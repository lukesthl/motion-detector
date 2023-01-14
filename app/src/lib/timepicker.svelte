<script lang="ts">
  import { TimePickerModal } from "svelte-time-picker";
  import Clockicon from "./icons/clockicon.svelte";

  export let value: Date;
  export let onChange: (value: Date) => void;

  let showModal = false;
  const timePickerOptions = {
    hasButtons: true,
    is24h: navigator.language.includes("de"),
    zIndex: 10,
  };
</script>

<button
  class="border border-gray-200 rounded-lg px-3 py-2 text-gray-500 bg-white inline-flex items-center"
  on:click={() => (showModal = true)}
>
  <Clockicon className="w-5 h-5 text-gray-400 stroke-2 mr-1" />
  {new Intl.DateTimeFormat(["de-DE", "en"], {
    timeStyle: "short",
  }).format(value)}
  {#if navigator.language.includes("de")}
    Uhr
  {/if}
</button>
{#if showModal}
  <TimePickerModal
    on:ok={(event) => onChange(event.detail)}
    on:close={() => (showModal = false)}
    date={value}
    options={timePickerOptions}
  />
{/if}
