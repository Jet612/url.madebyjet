const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const encodeBase62 = (num: number): string => {
  if (num === 0) return CHARSET[0];
  let res = "";
  while (num > 0) {
    res = CHARSET[num % 62] + res;
    num = Math.floor(num / 62);
  }
  return res;
};

// Simple hashing function to generate a pseudo-random number from a string
// Used to generate a seed for the base62 encoder if we aren't using a sequential DB ID
export const generateShortCode = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  // Take last 7 chars to keep it short but unique enough for client-side demo
  return encodeBase62(timestamp + random).slice(-7);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};