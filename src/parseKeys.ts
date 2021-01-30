import type { WhenLookup, WhenLookupKeys } from './types';
import { elseSymbol } from './symbols';
import { createOperatorHandlers } from './operators/operatorHandlers';

export const parseKeys = <T extends WhenLookup>(value: any, lookup: T) => {
  const entries = Object.entries(lookup);

  const result = entries.find(([key]) => {
    return parseKey(key, value);
  });

  if (result) {
    return result[1];
  }

  return lookup[elseSymbol as any];
};

const parseKey = (key: WhenLookupKeys, value: any): boolean => {
  if (key === elseSymbol) {
    return false;
  }

  for (const operator of createOperatorHandlers()) {
    const regexpMatch =
      operator.match instanceof RegExp && operator.match.test(key.toString());
    const matchFnResult =
      !(operator.match instanceof RegExp) && operator.match(key);

    if (regexpMatch || matchFnResult) {
      return operator.handler(key, value);
    }
  }

  return false;
};
