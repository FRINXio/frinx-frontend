import pino from 'pino';

type Logger = {
  info: (text: string) => void;
  error: (text: string) => void;
};

function getLogger(name: string): Logger {
  const logger = pino({
    name,
    base: {},
    transport: {
      target: 'pino-pretty',
    },
    formatters: {
      level: (label) => ({ level: label }), // show log-level as text, like `"error"`, not as number, like `50`.
    },
  });
  return {
    info: (text: string) => {
      logger.info(text);
    },
    error: (text: string) => {
      logger.error(text);
    },
  };
}

export default getLogger;
