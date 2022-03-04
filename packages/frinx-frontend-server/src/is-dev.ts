const ENVIRONMENT = process.env.NODE_ENV || 'development';
const isProd = ENVIRONMENT === 'production';
const isDev = ENVIRONMENT === 'development';

if (!(isProd || isDev)) {
  throw new Error('server:static: isProd or isDev has to be true');
}

export default isDev;
