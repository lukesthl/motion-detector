import { IWebhookSettings } from "../lib/action";
import { logger } from "../utils/logger";

export class WebhookHandler {
  public async trigger(settings: IWebhookSettings): Promise<void> {
    const result = await fetch(settings.url);
    if (result) {
      const json = await result.json();
      logger.log({
        level: "info",
        message: JSON.stringify(json),
      });
    }
  }
}
