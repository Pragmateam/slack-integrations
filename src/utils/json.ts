export const toFormattedString = (value: unknown): string => {
  return JSON.stringify(value, null, 2);
};
