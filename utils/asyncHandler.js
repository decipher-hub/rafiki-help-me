/**
 * Wraps async Express handlers so rejected promises become `next(err)`.
 */
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
