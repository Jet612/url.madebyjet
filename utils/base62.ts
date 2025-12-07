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

/**
 * Generate a secure, unpredictable short code
 */
export const generateShortCode = (): string => {
  const bytes = new Uint8Array(6);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // Fallback for older environments
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  let num = 0;
  for (let i = 0; i < bytes.length; i++) {
    num = num * 256 + bytes[i];
  }

  const code = encodeBase62(num);

  if (code.length < 8) {
    const paddingLength = 8 - code.length;
    const paddingBytes = new Uint8Array(paddingLength);
    if (typeof crypto !== 'undefined') {
      crypto.getRandomValues(paddingBytes);
    }
    let padding = '';
    for (let i = 0; i < paddingLength; i++) {
      padding += CHARSET[(typeof crypto !== 'undefined' ? paddingBytes[i] : Math.floor(Math.random() * 256)) % 62];
    }
    return code + padding;
  }

  // Take first 8 characters if longer
  return code.slice(0, 8);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};