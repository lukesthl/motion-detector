import Axios from "axios";
import { ApplicationStore } from "./application.store";

interface ISettings {
  sleepFrom: number;
  sleepTo: number;
}

export class SettingsService {
  public static async getSettings(): Promise<ISettings> {
    return (
      await Axios.get<ISettings>(`${ApplicationStore.serverUrl}/settings`)
    ).data;
  }

  public static async saveSettings(settings: ISettings): Promise<ISettings> {
    return (
      await Axios.patch<ISettings>(
        `${ApplicationStore.serverUrl}/settings`,
        settings
      )
    ).data;
  }

  public static async deleteAppData(): Promise<void> {
    await Axios.delete<ISettings>(
      `${ApplicationStore.serverUrl}/settings/appdata`
    );
  }
}
