import { ServerWebSocket } from "bun";

export interface IConnection {
  uuid: string;
  socket: ServerWebSocket<{ uuid: string }>;
}
