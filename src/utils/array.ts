export const filterByPredicate = <T>(
  array: T[],
  ...predicates: Array<(item: T) => boolean | undefined>
) => {
  return predicates.reduce((arr, predicate) => arr.filter(predicate), array);
};

export const filterByObjectKey = <T, K extends keyof T>(
  array: T[],
  property: K,
  value: T[K]
) => {
  return array.filter((object) => object[property] === value);
};
