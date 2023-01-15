<script lang="ts">
  import type { IColumn } from "./column";

  export let columns: IColumn[];
  export let data: object[];
  export let style: "solid" | "transparent" = "solid";
</script>

<table
  class="w-full divide-y divide-gray-200 border-collapse  overflow-y-scroll h-52"
>
  <thead class={style === "solid" ? "bg-gray-50" : ""}>
    <tr>
      {#each columns as column}
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >{column.title}</th
        >
      {/each}
    </tr>
  </thead>
  <tbody class="{style === 'solid' ? 'bg-white' : ''} divide-y divide-gray-200">
    {#if data.length === 0}
      <td
        class="{style === 'solid'
          ? 'bg-white'
          : ''} py-4 px-4 text-center text-sm {style === 'solid'
          ? 'text-gray-500'
          : 'text-gray-700'}"
        colspan={columns.length}
      >
        No entries..
      </td>
    {/if}
    {#each data as item}
      <tr>
        {#each columns as column}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <td
            class="px-6 py-4 whitespace-nowrap text-sm {style === 'solid'
              ? 'text-gray-500'
              : 'text-gray-700'}"
            on:click={() => column.onClick && column.onClick(item)}
            >{#if column.render}
              {column.render(item)}
            {:else if column.component}
              <svelte:component this={column.component} {...item} />
            {/if}</td
          >
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
