import { readableStreamToText, spawn, spawnSync } from "bun";
import { logger } from "./utils/logger";

type Event = "motion-stop" | "motion-start" | "stop" | "start";

export class MotionDetector {
  public on: (event: Event) => void;
  private GPIO_PIN: number;

  constructor(GPIO_PIN: number) {
    this.GPIO_PIN = GPIO_PIN;
  }

  public start = async () => {
    this.on("start");
    if (process.env.NODE_ENV === "production") {
      logger.log({
        level: "info",
        message: `start motiondetector on GPIO Pin: ${this.GPIO_PIN}`,
      });
      const { stdout } = spawn(["python3", "./src/lib/motion.detector.py"], {
        stdout: "pipe",
      });
      const reader = (stdout as ReadableStream).getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value: log } = await reader.read();
        if (done) {
          break;
        }
        this.on(decoder.decode(log).trim() as Event);
      }
    }
    //  else {
    //   console.log("emulate script");
    //   setInterval(() => {
    //     this.on("motion-start");
    //     setTimeout(() => {
    //       this.on("motion-stop");
    //     }, 5000);
    //   }, 10000);
    // }
  };
}
