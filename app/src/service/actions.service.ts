import Axios from "axios";
import type { IAction } from "../interfaces/action";
import { ApplicationStore } from "../stores/application.store";

export class ActionsService {
  public static async getActions(): Promise<IAction[]> {
    return (await Axios.get<IAction[]>(`${ApplicationStore.serverUrl}/actions`))
      .data;
  }

  public static async deleteAction(id: number): Promise<void> {
    await Axios.delete<IAction[]>(
      `${ApplicationStore.serverUrl}/actions/${id}`
    );
  }
  public static async manualTrigger(): Promise<void> {
    await Axios.post(`${ApplicationStore.serverUrl}/actions/trigger/manual`);
  }

  public static async saveAction(action: Partial<IAction>): Promise<IAction> {
    if (!action.id) {
      return (
        await Axios.post<IAction>(
          `${ApplicationStore.serverUrl}/actions`,
          action
        )
      ).data;
    } else {
      return (
        await Axios.patch<IAction>(
          `${ApplicationStore.serverUrl}/actions/${action.id}`,
          action
        )
      ).data;
    }
  }
}
