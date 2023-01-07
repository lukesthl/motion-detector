import { v4 } from "uuid";
import { MotionDetectorDatabase } from "./database";
import { ActionHandler } from "./action.handler";
import { HttpController } from "./http.controller";
import { MotionDetector } from "./motion.detector";
import { WebSocketHandler } from "./websocket.handler";
import { logger } from "./utils/logger";

const port = 4001;

const database = new MotionDetectorDatabase();
database.init();

const motionDetector = new MotionDetector(14);
const eventHandler = new ActionHandler();

const server = Bun.serve({
  port: port,
  websocket: WebSocketHandler,
  fetch(req, server) {
    if (
      server.upgrade(req, {
        data: {
          uuid: v4(),
        },
      })
    ) {
      return;
    }
    return HttpController.use({ req, server, database, motionDetector });
  },
});

motionDetector.on = (event) => {
  if (event === "start") {
    logger.log({
      level: "info",
      message: "motion detector started",
    });
  }
  if (event === "motion-start") {
    eventHandler.trigger(database);
  }
  WebSocketHandler.connections.forEach((connection) => {
    connection.socket.send(event);
    logger.log({
      level: "info",
      message: `sent event (${event}) to ${connection.uuid}`,
    });
  });
  database.addActivity(event, process.env.SERVER_ORIGIN);
};

void motionDetector.start();

logger.log({
  level: "info",
  message: `Waiting for clients to connect...\n http://${server.hostname}:${port}/`,
});
