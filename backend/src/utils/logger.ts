const winston = require("winston");
const { combine, timestamp, printf, colorize, align } = winston.format;

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    align(),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] [${level.toString().toUpperCase()}]: ${message}`
    ),
    colorize({ all: true })
  ),
  defaultMeta: { service: "motion-detector-backend" },
  transports: [new winston.transports.Console()],
});
