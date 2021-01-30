import { WhenLookup, WhenResult } from './types';
import { parseKeys } from './parseKeys';

export const when = <
  TLookup extends WhenLookup = WhenLookup,
  Key extends keyof TLookup = keyof TLookup
>(
  value: any,
  lookup: TLookup
): WhenResult<TLookup[Key]> | undefined => {
  if (lookup[value]) {
    const result = lookup[value];

    return handleResult(result);
  }

  return handleResult(parseKeys(value, lookup));
};

const handleResult = <T>(value?: T): WhenResult<T> => {
  return typeof value === 'function' ? value() : value;
};
