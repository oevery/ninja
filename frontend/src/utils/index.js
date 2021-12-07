/**
 *
 * @param {Number} time
 * @returns Promise
 */
export function wait(time) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * open url with jing dong
 * @param {String} url url string
 */
export function openUrlWithJD(url) {
  const params = encodeURIComponent(
    `{"category":"jump","des":"m","action":"to","url":"${url}"}`
  );
  window.location.href = `openapp.jdmobile://virtual?params=${params}`;
}
