import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

// Niveles personalizados
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    debug: 'blue',
    http: 'magenta',
    info: 'green',
    warning: 'yellow',
    error: 'red',
    fatal: 'bold red'
  }
};

winston.addColors(customLevels.colors);

const createLogger = (env) => {
  console.log(`Environment: ${env}`);

  if (env === 'development') {
    return winston.createLogger({
      levels: customLevels.levels,
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple(),
        winston.format.timestamp()
      ),
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        })
      ],
    });
  } else if (env === 'production') {
    return winston.createLogger({
      levels: customLevels.levels,
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.errors({ stack: true }),
        winston.format.splat()
      ),
      defaultMeta: { service: 'user-service' },
      transports: [
        new winston.transports.File({ filename: 'src/logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'src/logs/infoProduction.log', level: 'info' })
      ],
    });
  } else {
    throw new Error(`Unknown environment: ${env}`);
  }
};

const env = process.env.NODE_ENV || 'development';
const logger = createLogger(env);

export default logger;