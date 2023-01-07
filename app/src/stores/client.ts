import { ActionType } from "../interfaces/action";
import { ActionsService } from "../service/actions.service";
import { messages } from "./message.store";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";

export class Client {
  public client: WebSocket;

  constructor(url: string) {
    this.client = new WebSocket(url);
    this.addListener();
  }

  public addListener() {
    this.client.onopen = (message) => console.log(message);
    this.client.onmessage = (message) => this.onMessage(message);
  }

  public reconnect() {
    this.client = new WebSocket(this.client.url);
    this.addListener;
  }

  public close() {
    this.client.close();
  }

  public async onMessage(
    message: MessageEvent<"motion-start" | "motion-stop">
  ): Promise<void> {
    console.log(message.data);
    if (message.data === "motion-start") {
      const actions = (await ActionsService.getActions()).filter(
        (action) => action.active
      );
      for (const action of actions) {
        if (action.type === ActionType.NOTIFICATION) {
          let permissionGranted = await isPermissionGranted();
          if (!permissionGranted) {
            const permission = await requestPermission();
            permissionGranted = permission === "granted";
          }
          if (permissionGranted) {
            sendNotification(action.settings.title);
          }
        }
      }
    }
    messages.update((value) => [...value, message.data]);
  }
}
