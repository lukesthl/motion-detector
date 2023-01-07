import { YeelightHandler } from "./actions/yeelight.handler";
import { MotionDetectorDatabase } from "./database";
import { ActionType, IAction, IYeelightSettings } from "./lib/action";
import { logger } from "./utils/logger";

export class ActionHandler {
  private events: Record<
    ActionType,
    (settings: IAction["settings"]) => Promise<void> | void
  > = {
    YEELIGHT: async (settings: IYeelightSettings) => {
      const yeelightHandler = new YeelightHandler();
      await yeelightHandler.trigger(settings);
    },
    [ActionType.WEBHOOK]: function (
      settings: { bulbIp: string } | { url: string } | { title: string }
    ): void {
      throw new Error("Function not implemented.");
    },
    NOTIFICATION: (
      settings: { bulbIp: string } | { url: string } | { title: string }
    ) => {
      logger.log({
        level: "info",
        message: "will be executed by client",
      });
    },
  };

  public async trigger(database: MotionDetectorDatabase): Promise<void> {
    const actions = database.getActions().filter((action) => action.active);

    if (actions.length === 0) {
      logger.log({
        level: "warn",
        message: `no active actions configured`,
      });
    }
    let errorToThrow;
    for (const action of actions) {
      logger.log({
        level: "info",
        message: `trigger action => ${action.name}, ${action.type}`,
      });
      const timeStart = performance.now();
      database.addActivity(
        `trigger action: ${action.name} (${action.type})`,
        process.env.SERVER_ORIGIN
      );
      try {
        await this.events[action.type](action.settings);
        const timeEnd = performance.now();
        logger.log({
          level: "info",
          message: `trigger action end (${(timeEnd - timeStart).toFixed(
            2
          )}ms): ${action.name}, ${action.type}`,
        });
      } catch (error) {
        errorToThrow = error;
        database.addActivity(
          `failed to trigger action: '${action.name}' (Error: ${error.name} Message: ${error.message})`,
          process.env.SERVER_ORIGIN
        );
      }
    }
    if (errorToThrow) {
      throw errorToThrow;
    }
  }
}
