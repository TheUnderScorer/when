import { negationChar } from './negation';

export const inRange = (from: number, to: number) => `in ${from}..${to}`;

export const notInRange = (from: number, to: number) =>
  `${negationChar}${inRange(from, to)}`;

export const inArray = (values: Array<string | number>) => values.join(', ');

export const notInArray = (values: Array<string | number>) =>
  `${negationChar}${inArray(values)}`;

type IsType =
  | 'string'
  | 'number'
  | 'bigint'
  | 'symbol'
  | 'boolean'
  | 'undefined'
  | 'object'
  | 'function';

export const is = (type: IsType) => `is ${type}`;

export const isNot = (type: IsType) => `${negationChar}${is(type)}`;
