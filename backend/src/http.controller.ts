import { Server } from "bun";
import { MotionDetectorDatabase } from "./database";
import { MotionDetector } from "./motion.detector";
import { logger } from "./utils/logger";
const { match } = require("path-to-regexp");

enum Method {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
  DELETE = "DELETE",
}

class HttpControllerSingleton {
  private defaultHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Expose-Headers": "motion-detector",
    "Access-Control-Allow-Headers": "*",
  };

  private routes = [
    {
      path: "/",
      method: Method.GET,
      controller: this.helloThere,
    },
    {
      path: "/activitylogs",
      method: Method.GET,
      controller: this.getActivities,
    },
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
    for (const route of this.routes) {
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

  private async helloThere(): Promise<Response> {
    return new Response("hello there", {
      headers: { "motion-detector": "hello there" },
    });
  }

  private getActivities(_req: Request, db: MotionDetectorDatabase): Response {
    const activities = db.getActivities();
    return new Response(JSON.stringify(activities));
  }

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
    req: Request,
    db: MotionDetectorDatabase
  ): Promise<Response> {
    console.log("delete appdata!");
    db.deleteAppData();
    return new Response("success");
  }

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
export const HttpController = new HttpControllerSingleton();
