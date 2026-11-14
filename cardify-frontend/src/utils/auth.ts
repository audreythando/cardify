export const SESSION_EXPIRED_EVENT = 'cardify-session-expired';

/** Reads the `exp` claim (seconds since epoch) from a JWT without verifying it. */
const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const exp = JSON.parse(json).exp;
    return typeof exp === 'number' ? exp : null;
  } catch {
    return null;
  }
};

/** True when a token is stored and has not passed its expiry time. */
export const isAuthenticated = () => {
  const token = localStorage.getItem('cardify_token');
  if (!token) return false;
  const exp = getTokenExpiry(token);
  return exp === null || exp * 1000 > Date.now();
};

export const logout = () => {
  localStorage.removeItem('cardify_token');
  localStorage.removeItem('cardify_user');
};
