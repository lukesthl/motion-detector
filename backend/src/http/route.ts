import { MotionDetectorDatabase } from "../database";
import { MotionDetector } from "../motiondetector/motion.detector";
import { Method } from "./method";

export interface IRoute {
  path: string;
  method: Method;
  controller: (
    _req: Request,
    db: MotionDetectorDatabase,
    motionDetector: MotionDetector
  ) => Promise<Response> | Response;
}
