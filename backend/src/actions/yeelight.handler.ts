import { connect, TCPSocketListener, TCPSocketOptions } from "bun";
import { IAction, IYeelightSettings } from "../lib/action";
import { logger } from "../utils/logger";

class Yeelight {
  private connection:
    | TCPSocketListener<
        TCPSocketOptions<{
          name: string;
        }>
      >
    | undefined;

  constructor(private ip: string, private port: number) {}

  async _sendCommand(objectCommand): Promise<void> {
    return new Promise(async (resolve, reject) => {
      logger.log({
        level: "info",
        message: `yeelight: sendCommand: ${JSON.stringify(objectCommand)}`,
      });
      this.connection = await connect({
        hostname: this.ip,
        port: this.port,
        socket: {
          open(socket) {
            objectCommand.id = Math.floor(Math.random() * 100000 + 1);
            socket.write(JSON.stringify(objectCommand) + "\r\n");
          },
          data(_socket, data) {
            const message = new TextDecoder().decode(data);
            logger.log({
              level: "info",
              message: `yeelight msg: ${message}`,
            });
            _socket.shutdown();
          },
          close() {
            logger.log({
              level: "info",
              message: `yeelight socket closed`,
            });
            resolve();
          },
          error(_, error) {
            logger.log({
              level: "error",
              message: error,
            });
            reject();
          },
        },
        data: {
          name: "motion-detector",
        },
      });
    });
  }

  public disconnect() {
    this.connection?.stop();
  }

  public async set_power(
    power = "on",
    effect = "smooth",
    duration = 500,
    mode = 0
  ): Promise<void> {
    return this._sendCommand({
      method: "set_power",
      params: [
        this._ifValid(power, ["on", "off"], "on"),
        this._ifValid(effect, ["smooth", "sudden"], "smooth"),
        duration || 500,
        this._ifValid(mode, [0, 1, 2, 3, 4, 5], 0),
      ],
    });
  }

  public async set_rgb(
    rgb = [255, 255, 255],
    effect = "smooth",
    duration = 500
  ): Promise<void> {
    const rgbValue =
      this._constrain(rgb[0], 0, 255) * 65536 +
      this._constrain(rgb[1], 0, 255) * 256 +
      this._constrain(rgb[2], 0, 255);
    return this._sendCommand({
      method: "set_rgb",
      params: [
        rgbValue,
        this._ifValid(effect, ["smooth", "sudden"], "smooth"),
        duration || 500,
      ],
    });
  }

  _constrain(input = 0, min = 0, max = 0) {
    const intInput = isNaN(parseInt(input.toString()))
      ? 0
      : parseInt(input.toString());
    return Math.min(Math.max(intInput, min), max);
  }

  _inArray(needle: string | number = "", haystack = []) {
    return Array.isArray(haystack) && haystack.includes(needle);
  }

  _ifValid(
    needle: string | number = "",
    haystack = [],
    fallback: string | number = ""
  ) {
    return this._inArray(needle, haystack) ? needle : fallback;
  }
}

export class YeelightHandler {
  public async trigger(settings: IYeelightSettings): Promise<void> {
    try {
      const yeelight = new Yeelight(settings.bulbIp, 55443);
      await yeelight.set_power("on", "sudden");
      await yeelight.set_rgb(JSON.parse(settings.color));
      await yeelight.set_power("off");
    } catch (error) {
      console.log(error);
    }
    // yeelight.disconnect();
  }
}
