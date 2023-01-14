import { Store } from "tauri-plugin-store-api";
import { Client } from "./client";

class ApplicationStoreSingleton {
  public loaded = false;

  private cached = new Map<string, string>();

  private store = new Store(".application.store.dat");

  public connection: Client | undefined;

  public async init(): Promise<void> {
    this.loaded = false;
    const serverUrl = await this.store.get("serverurl");
    console.log(serverUrl);
    if (serverUrl && typeof serverUrl === "string") {
      this.cached.set("serverUrl", serverUrl);
      const websocketUrl = serverUrl.replace("http", "ws");
      this.connection = new Client(websocketUrl);
    }

    this.loaded = true;
  }

  public async saveConfig({ serverUrl }: { serverUrl: string }): Promise<void> {
    console.log("this.saveConfig", serverUrl);
    await this.store.set("serverurl", serverUrl);
  }

  public async reset(): Promise<void> {
    await this.store.reset();
  }

  public get serverUrl(): string | undefined {
    return this.cached.get("serverUrl");
  }
}

export const ApplicationStore = new ApplicationStoreSingleton();
