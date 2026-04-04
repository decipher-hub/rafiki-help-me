/**
 * Optional shared validators. Add functions here as your forms grow.
 * Example: export function isNonEmptyString(v) { return typeof v === 'string' && v.trim().length > 0; }
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
