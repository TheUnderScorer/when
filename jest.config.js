module.exports = {
  preset: 'ts-jest',

  testMatch: ['**/*.test.ts?(x)'],

  collectCoverageFrom: [
    'src/**/*.ts?(x)',
    '!**/{*.d.ts,index.ts}',
    '!**/node_modules/**',
    '!/build/**',
  ],

  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
};
