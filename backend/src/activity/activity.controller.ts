import { MotionDetectorDatabase } from "../database";
import { BunController } from "../utils/bun.controller";
import { Method } from "../http/method";

export class ActivityController implements BunController {
  public routes = [
    {
      path: "/activitylogs",
      method: Method.GET,
      controller: this.getActivities,
    },
  ];

  private getActivities(_req: Request, db: MotionDetectorDatabase): Response {
    const activities = db.getActivities();
    return new Response(JSON.stringify(activities));
  }
}
