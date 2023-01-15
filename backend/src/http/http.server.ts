import { Server } from "bun";
import { ActionsController } from "../actions/actions.controller";
import { ActivityController } from "../activity/activity.controller";
import { MotionDetectorDatabase } from "../database";
import { HelloController } from "../hello/hello.controller";
import { MotionDetector } from "../motiondetector/motion.detector";
import { SettingsController } from "../settings/settings.controller";
import { logger } from "../utils/logger";
import { Method } from "./method";
import { IRoute } from "./route";
const { match } = require("path-to-regexp");

class HttpServerSingleton {
  private defaultHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Expose-Headers": "motion-detector",
    "Access-Control-Allow-Headers": "*",
  };

  private controllers = [
    new SettingsController(),
    new ActionsController(),
    new ActivityController(),
    new HelloController(),
  ];

  private getRoutes(): IRoute[] {
    const routes = [];
    this.controllers.forEach((controller) => routes.push(...controller.routes));
    return routes;
  }

  public async use({
    req,
    server: _server,
    database,
    motionDetector,
  }: {
    req: Request & { params?: Record<string, string> };
    server: Server;
    database: MotionDetectorDatabase;
    motionDetector: MotionDetector;
  }): Promise<Response> {
    const startTime = performance.now();
    const url = new URL(req.url);
    let response = new Response("Not Found", {
      status: 404,
    });
    for (const route of this.getRoutes()) {
      const matchRoute = match(route.path, { decode: decodeURIComponent })(
        url.pathname
      );
      if (
        matchRoute &&
        (req.method === route.method || req.method === Method.HEAD)
      ) {
        req.params = matchRoute?.params ? matchRoute.params : undefined;
        try {
          response = await route.controller(req, database, motionDetector);
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
          response = new Response("", { status: 500 });
        }
        break;
      }
      if (matchRoute && req.method === Method.OPTIONS) {
        response = new Response("");
        break;
      }
    }
    for (const [key, value] of Object.entries(this.defaultHeaders)) {
      response.headers.set(key, value);
    }
    const endTime = performance.now();
    const logLevel =
      response.status >= 200 && response.status < 300 ? "info" : "error";
    logger.log({
      level: logLevel,
      message: `${req.method} (${response.status}) (${(
        endTime - startTime
      ).toFixed(2)} ms) ${url.pathname}`,
    });
    return response;
  }
}
export const HttpServer = new HttpServerSingleton();
