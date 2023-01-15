<script lang="ts">
  import Axios from "axios";
  import { onMount } from "svelte";
  import type { IActivityLog } from "./activitylog";
  import { ApplicationStore } from "../settings/application.store";
  import Container from "../lib/header.svelte";
  import Refreshicon from "../icons/refreshicon.svelte";
  import Table from "../lib/table/table.svelte";
  import type { IColumn } from "../lib/table/column";

  let activityLogs: IActivityLog[] = [];

  const loadActivities = async (): Promise<void> => {
    const response = await Axios.get<IActivityLog[]>(
      `${ApplicationStore.serverUrl}/activitylogs`
    );
    activityLogs = response.data.sort((a, b) => b.date - a.date);
  };

  onMount(async function () {
    loadActivities();
  });

  const columns: IColumn<IActivityLog>[] = [
    {
      title: "Server",
      render: (source: IActivityLog) => source.origin,
    },
    {
      title: "Event",
      render: (source: IActivityLog) => source.event,
    },
    {
      title: "Date",
      render: (source: IActivityLog) =>
        new Intl.DateTimeFormat(["de-DE", "en"], {
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(source.date),
    },
  ];
</script>

<Container>
  <svelte:fragment slot="title">
    <div class="flex items-center">
      Activity Logs <button on:click={loadActivities}
        ><Refreshicon className="ml-2 w-5 h-5 stroke-2 text-gray-500" /></button
      >
    </div>
  </svelte:fragment>
  <div class="w-full">
    <div class="w-full overflow-x-auto">
      <div class="py-2 w-full align-middle inline-block min-w-full">
        <div class="overflow-hidden border border-gray-200 sm:rounded-lg">
          <Table {columns} data={activityLogs} />
        </div>
      </div>
    </div>
  </div>
</Container>
