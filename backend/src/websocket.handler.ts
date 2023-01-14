import { ServerWebSocket, WebSocketHandler as IWebSocketHandler } from "bun";
import { IConnection } from "./interfaces";
import { logger } from "./utils/logger";

const MAX_CONNECTIONS = 1;

class WebSocketHandlerSingleton implements IWebSocketHandler {
  private _connections: IConnection[] = [];

  public get connections(): IConnection[] {
    return this._connections;
  }

  private set connections(value: IConnection[]) {
    this._connections = value;
  }

  public open = (ws: ServerWebSocket<{ uuid: string }>) => {
    if (this.connections.length >= MAX_CONNECTIONS) {
      logger.log({
        level: "warn",
        message: "max connections reached",
      });
      this.connections.forEach((conn) => {
        logger.log({
          level: "info",
          message: `closing other connection ${conn.uuid}`,
        });
        conn.socket.close();
      });
      this.connections = [];
    }
    this.connections.push({
      uuid: ws.data.uuid,
      socket: ws,
    });
    ws.subscribe("motion-detection");
    logger.log({
      level: "info",
      message: `${ws.data.uuid} connected`,
    });
  };

  public message = (ws, message) => {
    logger.log({
      level: "info",
      message,
    });
  };

  public close = (ws: ServerWebSocket<{ uuid: string }>) => {
    logger.log({
      level: "info",
      message: `${ws.data.uuid} disconnected`,
    });
    this.connections = this.connections.filter(
      (conn) => conn.uuid !== ws.data.uuid
    );
  };
}
export const WebSocketHandler = new WebSocketHandlerSingleton();
