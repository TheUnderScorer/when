import { WhenLookupKeys } from '../types';
import { isNegation } from './negation';
import { negationChar } from './negation';

interface OperatorHandler {
  match: RegExp | ((key: WhenLookupKeys) => boolean);
  handler: (key: any, value: any) => boolean;
}

export const createOperatorHandlers = (): OperatorHandler[] => [
  {
    // Example: in 1..5
    match: /in [0-9]+\.\.[0-9]+/gm,
    handler: (key: string, value) => {
      const negation = isNegation(key);
      const parsedValue = parseInt(value);

      if (Number.isNaN(parsedValue)) {
        return false;
      }

      const numbers = key
        .replace(negationChar, '')
        .replace('in ', '')
        .split('..')
        .map((number) => parseInt(number));

      if (numbers.find((number) => Number.isNaN(number))) {
        return false;
      }

      const [firstNumber, secondNumber] = numbers;

      const result = value >= firstNumber && value <= secondNumber;

      return negation ? !result : result;
    },
  },
  {
    // Example: 1, 2, 3, 4 or (! 1, 2, 3, 4)
    match: /.*, */gm,
    handler: (key: string, value) => {
      const negation = key.startsWith(`${negationChar} `);
      const intValue = parseInt(value);
      const keyArr = (negation ? key.slice(2, key.length) : key).split(', ');

      const result = Boolean(
        keyArr.find((keyFromArr) => {
          const parsed = parseInt(keyFromArr);

          if (!Number.isNaN(parsed)) {
            return parsed === intValue;
          }

          return keyFromArr === value;
        })
      );

      return negation ? !result : result;
    },
  },
  {
    // Example: is string
    match: /is .*/gm,
    handler: (key: string, value: any) => {
      const negation = isNegation(key);
      const type = key.replace(negationChar, '').replace('is ', '');

      const result = typeof value === type;

      return negation ? !result : result;
    },
  },
];
