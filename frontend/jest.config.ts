import type { Config } from 'jest';

const config: Config = {
  rootDir: '.', 
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass|svg|png|jpg|jpeg)$': 'identity-obj-proxy',
  },
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx}',
    '<rootDir>/src/**/*.tests.{ts,tsx}',
    '<rootDir>/src/**/__tests__/*.{ts,tsx}',
  ],
};

export default config;