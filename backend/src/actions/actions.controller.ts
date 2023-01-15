import { MotionDetectorDatabase } from "../database";
import { BunController } from "../utils/bun.controller";
import { Method } from "../http/method";
import { IRoute } from "../utils/route";

export class ActionsController implements BunController {
  public routes = [
    {
      path: "/actions",
      method: Method.POST,
      controller: this.saveAction,
    },
    {
      path: "/actions/:id",
      method: Method.PATCH,
      controller: this.saveAction,
    },
    {
      path: "/actions",
      method: Method.GET,
      controller: this.getActions,
    },
    {
      path: "/actions/:id",
      method: Method.DELETE,
      controller: this.deleteAction,
    },
    {
      path: "/actions/trigger/manual",
      method: Method.POST,
      controller: this.manualTrigger,
    },
  ];

  private async saveAction(
    req: Request,
    db: MotionDetectorDatabase
  ): Promise<Response> {
    const bodyReader = req.body.getReader();
    const action = JSON.parse(
      new TextDecoder().decode((await bodyReader.read()).value)
    );
    db.saveAction(action);
    return new Response("success");
  }

  private async getActions(
    req: Request,
    db: MotionDetectorDatabase
  ): Promise<Response> {
    const actions = db.getActions();
    return new Response(JSON.stringify(actions));
  }

  private async deleteAction(
    req: Request & { params?: Record<string, string> },
    db: MotionDetectorDatabase
  ): Promise<Response> {
    const id = req.params.id;
    db.deleteAction(id);
    return new Response("success");
  }

  private async manualTrigger(
    req: Request & { params?: Record<string, string> },
    db: MotionDetectorDatabase,
    motionDetector: MotionDetector
  ): Promise<Response> {
    motionDetector.on("motion-start");
    motionDetector.on("motion-stop");
    return new Response("success");
  }
}
