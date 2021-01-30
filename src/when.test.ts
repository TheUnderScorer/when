import { when } from './when';
import { elseSymbol } from './symbols';
import { inRange } from './operators/operatorFunctions';

describe('When', () => {
  it('should handle simple lookup', () => {
    const value = 2;

    const result = when<boolean>(value, {
      1: false,
      2: true,
    });

    expect(result).toEqual(true);
  });

  it('should call function on match', () => {
    const fn = jest.fn();

    when('test', {
      test: fn,
      else: jest.fn(),
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should return value from "else" branch if no match was found', () => {
    const result = when('test', {
      'no-match': false,
      [elseSymbol]: 'PASSED',
    });

    expect(result).toEqual('PASSED');
  });

  describe('in NUMBER..NUMBER expression', () => {
    it('should handle simple lookup', () => {
      const value = 5;
      const fn = jest.fn();

      when(value, {
        'in 1..6': fn,
        'in 6..10': false,
      });

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should handle negation', () => {
      const value = 20;
      const fn = jest.fn();

      when(value, {
        '!in 1..6': fn,
        'in 6..10': false,
      });

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should handle equal values', () => {
      const value = 5;

      const result = when(value, {
        [inRange(0, 5)]: 'PASSED',
        'in 6..10': false,
      });

      expect(result).toEqual('PASSED');
    });
  });

  describe('Comma split expression', () => {
    it('should handle simple lookup with numbers', () => {
      const value = 5;

      const result = when(value, {
        '1, 2, 3, 4, 5': 'PASSED',
        'in 6..10': false,
      });

      expect(result).toEqual('PASSED');
    });

    it('should handle simple lookup with strings', () => {
      const value = 'TEST SENTENCE';

      const result = when(value, {
        'TEST SENTENCE, SMTH, LOL': 'PASSED',
        'in 6..10': false,
      });

      expect(result).toEqual('PASSED');
    });

    it('should handle negation', () => {
      const value = 'VALUE';

      const result = when(value, {
        '! TEST, SMTH, LOL': 'PASSED',
        'in 6..10': false,
      });

      expect(result).toEqual('PASSED');
    });
  });

  describe('"is" expression', () => {
    const types: Array<[string, any]> = [
      ['string', 'test'],
      ['number', 123],
      ['boolean', false],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      ['function', () => {}],
      ['undefined', undefined],
      ['object', {}],
      ['symbol', Symbol()],
    ];

    const typesNegated: Array<[string, any]> = [
      ['string', 123],
      ['number', 'test'],
      ['boolean', 'false'],
      ['function', ''],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      ['undefined', () => {}],
      ['object', ''],
      ['symbol', 123],
    ];

    test.each<[string, any]>(types)(
      'should handle is expression',
      (type, value) => {
        const result = when(value, {
          [`is ${type}`]: 'PASSED',
          other: 'FAILED',
        });

        expect(result).toEqual('PASSED');
      }
    );

    test.each<[string, any]>(typesNegated)(
      'should handle is expression with negation',
      (type, value) => {
        const result = when(value, {
          [`!is ${type}`]: 'PASSED',
          other: 'failed',
        });

        expect(result).toEqual('PASSED');
      }
    );
  });
});
