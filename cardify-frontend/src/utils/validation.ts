// Shared form validation helpers. Each validator returns an error message,
// or an empty string when the value is valid.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE = /^[\p{L}][\p{L}\s'.-]*$/u;
const PHONE_RE = /^\+?[0-9\s-]+$/;

export const LIMITS = {
  nameMax: 100,
  emailMax: 254,
  passwordMin: 8,
  passwordMax: 128,
  merchantMax: 100,
  maxAmount: 1_000_000,
  maxCreditLimit: 10_000_000,
  aiMessageMax: 1000,
} as const;

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export const hasErrors = (errors: Record<string, string | undefined>) =>
  Object.values(errors).some(Boolean);

export const validateEmail = (value: string): string => {
  const v = value.trim();
  if (!v) return 'Email is required.';
  if (v.length > LIMITS.emailMax) return 'Email is too long.';
  if (!EMAIL_RE.test(v)) return 'Enter a valid email address.';
  return '';
};

export const validatePersonName = (value: string, label = 'Name'): string => {
  const v = value.trim();
  if (!v) return `${label} is required.`;
  if (v.length < 2) return `${label} must be at least 2 characters.`;
  if (v.length > LIMITS.nameMax) return `${label} must be ${LIMITS.nameMax} characters or fewer.`;
  if (!NAME_RE.test(v)) return `${label} can only contain letters, spaces, hyphens and apostrophes.`;
  return '';
};

/** Password rules shown to the user and enforced on register / change password. */
export const PASSWORD_RULES = [
  { label: `At least ${LIMITS.passwordMin} characters`, test: (v: string) => v.length >= LIMITS.passwordMin },
  { label: 'One uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One number', test: (v: string) => /[0-9]/.test(v) },
  { label: 'One special character (e.g. ! @ # $)', test: (v: string) => /[^A-Za-z0-9\s]/.test(v) },
] as const;

export const validateNewPassword = (value: string): string => {
  if (!value) return 'Password is required.';
  if (value.length > LIMITS.passwordMax) return `Password must be ${LIMITS.passwordMax} characters or fewer.`;
  const missing = PASSWORD_RULES.filter((r) => !r.test(value));
  if (missing.length) return `Password needs: ${missing.map((r) => r.label.toLowerCase()).join(', ')}.`;
  return '';
};

export const validatePhone = (value: string): string => {
  const v = value.trim();
  if (!v) return ''; // optional
  const digits = v.replace(/\D/g, '');
  if (!PHONE_RE.test(v) || digits.length < 9 || digits.length > 15) {
    return 'Enter a valid phone number, e.g. +27 82 123 4567.';
  }
  return '';
};

/** Validates a money amount typed into a field. */
export const validateAmount = (
  raw: string,
  { label = 'Amount', max = LIMITS.maxAmount }: { label?: string; max?: number } = {}
): string => {
  if (!raw.trim()) return `${label} is required.`;
  const n = Number(raw);
  if (!Number.isFinite(n)) return `${label} must be a number.`;
  if (n <= 0) return `${label} must be greater than R0.`;
  if (!/^\d+(\.\d{1,2})?$/.test(raw.trim())) return `${label} can have at most 2 decimal places.`;
  if (n > max) return `${label} cannot exceed R${max.toLocaleString('en-ZA')}.`;
  return '';
};

/**
 * Pulls a readable message out of an API error. Handles plain-string bodies,
 * `{ message }` bodies and ASP.NET validation problem details (`{ errors: { Field: [msg] } }`).
 */
export const getApiErrorMessage = (err: unknown, fallback: string): string => {
  const data = (err as { response?: { data?: unknown } })?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data && typeof data === 'object') {
    const d = data as { message?: string; errors?: Record<string, string[]>; title?: string };
    if (d.message) return d.message;
    const first = d.errors && Object.values(d.errors).flat()[0];
    if (first) return first;
  }
  return fallback;
};
