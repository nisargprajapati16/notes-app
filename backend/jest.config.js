module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx,js,jsx}',
    '<rootDir>/src/**/__tests__/*.{ts,tsx,js,jsx}',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};