module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      compiler: 'ttypescript',
    },
  },
  moduleFileExtensions: ['js', 'ts', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/**/*.test.(ts|js)'],
  testEnvironment: 'node',
  // added for jest to look for the dependencies
  modulePaths: ['src/'],
  transformIgnorePatterns: ['node_modules/(?!graasp-.*)'],
  setupFiles: ['<rootDir>/test/config.ts'],
};
