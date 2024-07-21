import winston from 'winston';

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

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'src/logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'src/logs/combined.log', level: 'debug' }), 
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
    }),
  ],
});

export default logger;