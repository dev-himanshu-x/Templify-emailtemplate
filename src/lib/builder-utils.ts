/**
 * Generates a short unique ID.
 */
export const generateId = () => Math.random().toString(36).substring(2, 11);

/**
 * Throttles a function call.
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  } as T;
}
