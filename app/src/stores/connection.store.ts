import { writable } from "svelte/store";

export const connectionStatus = writable<
  "disconnected" | "connected" | "waitingforconnection"
>("waitingforconnection");
