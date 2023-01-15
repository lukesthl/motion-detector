import { MotionDetectorDatabase } from "../database";
import { BunController } from "../utils/bun.controller";
import { Method } from "../http/method";

export class HelloController implements BunController {
  public routes = [
    {
      path: "/",
      method: Method.GET,
      controller: this.helloThere,
    },
  ];

  private async helloThere(): Promise<Response> {
    return new Response("hello there", {
      headers: { "motion-detector": "hello there" },
    });
  }
}
