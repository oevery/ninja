/**
 *
 * @param {Number} time
 * @returns Promise
 */
export function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
