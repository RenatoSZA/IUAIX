export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is not defined in the environment variables. This is required in production.');
    }
    // Fallback apenas em desenvolvimento
    return new TextEncoder().encode('fallback_secret_for_dev_only');
  }
  
  return new TextEncoder().encode(secret);
}
