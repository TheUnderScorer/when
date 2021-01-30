import { WhenLookup } from './types';
import { parseKeys } from './parseKeys';

export const when = <Value, TLookup extends WhenLookup<Value> = WhenLookup>(
  value: any,
  lookup: TLookup
): Value | undefined => {
  if (lookup[value]) {
    return handleResult(lookup[value] as any);
  }

  return handleResult(parseKeys(value, lookup));
};

const handleResult = <T>(
  value?: T
): T extends () => infer ReturnValue ? ReturnValue : T => {
  return typeof value === 'function' ? value() : value;
};
