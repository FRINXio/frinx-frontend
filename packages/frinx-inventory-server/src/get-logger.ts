import pino from 'pino';
import isDev from './is-dev';

type Logger = {
  info: (text: string) => void;
  error: (text: string) => void;
};

const shouldPrettyPrint = isDev;

function getLogger(name: string): Logger {
  const logger = pino({
    name,
    base: {},
    prettyPrint: shouldPrettyPrint, // pretty-print in dev-mode
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
