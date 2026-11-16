import 'dotenv/config';

/**
 * Read a required environment variable or stop with a clear message.
 * Keeps misconfiguration errors obvious instead of a cryptic 401 from the hub.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env and set it.`,
    );
  }
  return value;
}

export function optionalEnv(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== '' ? value : fallback;
}
