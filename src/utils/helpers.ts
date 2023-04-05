/**
 * Runs the given async function with a delay specified by the given timeout value.
 * The timeout is cancelled if the function is executed before the timeout expires.
 * @param func The async function to execute.
 * @param timeout The delay time in milliseconds. Default is 0.
 * @param args The arguments to pass to the function.
 * @returns A function that can be used to cancel the timeout.
 */
export const deferredExecute = <T extends unknown[], R>(
  func: (...args: T) => Promise<R>,
  timeout = 0,
  ...args: T
): (() => void) => {
  let timerId: ReturnType<typeof setTimeout>;
  const wrapperFunc = async () => {
    await func(...args);
    clearTimeout(timerId);
  };
  timerId = setTimeout(wrapperFunc, timeout);

  return () => clearTimeout(timerId);
};
