import { MotionDetectorDatabase } from "../database";
import { BunController } from "../http/bun.controller";
import { Method } from "../http/method";

export class SettingsController implements BunController {
  public routes = [
    {
      path: "/settings",
      method: Method.GET,
      controller: this.getSettings,
    },
    {
      path: "/settings",
      method: Method.PATCH,
      controller: this.saveSettings,
    },
    {
      path: "/settings/appdata",
      method: Method.DELETE,
      controller: this.deleteAppData,
    },
  ];

  private getSettings(_req: Request, db: MotionDetectorDatabase): Response {
    const settings = db.getSettings();
    return new Response(JSON.stringify(settings));
  }

  private async saveSettings(
    req: Request,
    db: MotionDetectorDatabase
  ): Promise<Response> {
    const bodyReader = req.body.getReader();
    const settings = JSON.parse(
      new TextDecoder().decode((await bodyReader.read()).value)
    );
    db.saveSettings(settings);
    return new Response("success");
  }

  private async deleteAppData(
    _req: Request,
    db: MotionDetectorDatabase
  ): Promise<Response> {
    console.log("delete appdata!");
    db.deleteAppData();
    return new Response("success");
  }
}
