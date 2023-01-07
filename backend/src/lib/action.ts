export type IAction = {
  id: number;
  active: number | boolean;
  name: string;
} & CustomActionType;

type CustomActionType =
  | {
      type: ActionType.YEELIGHT;
      settings: IYeelightSettings;
    }
  | {
      type: ActionType.WEBHOOK;
      settings: IWebhookSettings;
    }
  | {
      type: ActionType.NOTIFICATION;
      settings: {
        title: string;
      };
    };
export interface IYeelightSettings {
  bulbIp: string;
  color: string;
}
export interface IWebhookSettings {
  url: string;
}

export enum ActionType {
  YEELIGHT = "YEELIGHT",
  WEBHOOK = "WEBHOOK",
  NOTIFICATION = "NOTIFICATION",
}
