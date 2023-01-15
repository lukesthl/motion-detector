import { WebhookHandler } from "./webhook.handler";
import { YeelightHandler } from "./yeelight.handler";
import { MotionDetectorDatabase } from "../database";
import {
  ActionType,
  IAction,
  IWebhookSettings,
  IYeelightSettings,
} from "./action";
import { logger } from "../utils/logger";

export class ActionHandler {
  private events: Record<
    ActionType,
    (settings: IAction["settings"]) => Promise<void> | void
  > = {
    YEELIGHT: async (settings: IYeelightSettings) => {
      const yeelightHandler = new YeelightHandler();
      await yeelightHandler.trigger(settings);
    },
    WEBHOOK: async (settings: IWebhookSettings) => {
      const yeelightHandler = new WebhookHandler();
      await yeelightHandler.trigger(settings);
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
    const settings = database.getSettings();
    const actions = database.getActions().filter((action) => action.active);

    const sleepFromTmp = new Date(settings.sleepFrom);
    const sleepToTmp = new Date(settings.sleepTo);
    const sleepFrom = new Date();
    sleepFrom.setHours(sleepFromTmp.getHours());
    sleepFrom.setMinutes(sleepFromTmp.getMinutes());

    const sleepTo = new Date();
    sleepFrom.setHours(sleepToTmp.getHours());
    sleepFrom.setMinutes(sleepToTmp.getMinutes());

    const now = new Date();
    if (actions.length === 0) {
      logger.log({
        level: "warn",
        message: `no active actions configured`,
      });
    }
    let errorToThrow;
    if (
      now.getTime() <= sleepTo.getTime() &&
      now.getTime() >= sleepFrom.getTime()
    ) {
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
    } else {
      logger.log({
        level: "info",
        message: `actions triggered in sleepmode`,
      });
    }
    if (errorToThrow) {
      throw errorToThrow;
    }
  }
}
