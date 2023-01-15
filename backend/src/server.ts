import { v4 } from "uuid";
import { MotionDetectorDatabase } from "./database";
import { ActionHandler } from "./actions/action.handler";
import { MotionDetector } from "./motiondetector/motion.detector";
import { WebSocketHandler } from "./websocket/websocket.handler";
import { logger } from "./utils/logger";
import { HttpServer } from "./http/http.server";

class Server {
  private port = process.env.PORT || 4001;

  private database = new MotionDetectorDatabase();
  private actionHandler = new ActionHandler();
  private motionDetector = new MotionDetector(parseInt(process.env.GPIO_PIN));

  public start(): void {
    this.database.init();

    const dbTmp = this.database;
    const motionDetectorTmp = this.motionDetector;
    const bunServer = Bun.serve({
      port: this.port,
      websocket: WebSocketHandler,
      fetch(req, bunServer) {
        if (
          bunServer.upgrade(req, {
            data: {
              uuid: v4(),
            },
          })
        ) {
          return;
        }
        return HttpServer.use({
          req,
          server: bunServer,
          database: dbTmp,
          motionDetector: motionDetectorTmp,
        });
      },
    });

    this.motionDetector.on = (event) => {
      if (event === "start") {
        logger.log({
          level: "info",
          message: "motion detector started",
        });
      }
      WebSocketHandler.connections.forEach((connection) => {
        connection.socket.send(event);
        logger.log({
          level: "info",
          message: `sent event (${event}) to ${connection.uuid}`,
        });
      });
      this.database.addActivity(event, process.env.SERVER_ORIGIN);
      if (event === "motion-start") {
        this.actionHandler.trigger(this.database);
      }
    };

    void this.motionDetector.start();
    logger.log({
      level: "info",
      message: `Waiting for clients to connect...\n http://${bunServer.hostname}:${this.port}/`,
    });
  }
}

const server = new Server();

server.start();
