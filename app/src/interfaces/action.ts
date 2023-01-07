export type IAction = {
  id: number | null;
  active: boolean;
  name: string;
} & CustomActionType;

type CustomActionType =
  | {
      type: ActionType.YEELIGHT;
      settings: {
        bulbIp: string;
        color: string;
      };
    }
  | {
      type: ActionType.WEBHOOK;
      settings: {
        url: string;
      };
    }
  | {
      type: ActionType.NOTIFICATION;
      settings: {
        title: string;
      };
    };

export enum ActionType {
  YEELIGHT = "YEELIGHT",
  WEBHOOK = "WEBHOOK",
  NOTIFICATION = "NOTIFICATION",
}
