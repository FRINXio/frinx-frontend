function envString(key: string): string {
  const { env } = process;
  const value = env[key];
  if (typeof value !== 'string') {
    throw new Error(`Mandatory env variable "${key}" not found`);
  }

  return value;
}

const config = {
  host: envString('HOST'),
  port: envString('PORT'),
};

export default config;
