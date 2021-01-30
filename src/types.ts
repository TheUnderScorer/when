export type WhenLookupKeys =
  | `in ${number}..${number}`
  | `in ${string}`
  | `!in ${number}..${number}`
  | `!in ${string}`
  | `is ${string}`
  | symbol
  | number
  | string;

export type WhenLookup<T = any> = Record<WhenLookupKeys, T>;
export type WhenResult<T> = T extends () => infer ReturnVal ? ReturnVal : T;
