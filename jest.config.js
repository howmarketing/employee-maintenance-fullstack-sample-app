const nextJest = require('next/jest');
const { pathsToModuleNameMapper } = require('ts-jest');

const createJestConfig = nextJest({
    dir: "./",
});


/** @type {import('jest').config} */
const config = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    preset: 'ts-jest',
	pathsToModuleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
}

//export default createJestConfig(config)
module.exports = createJestConfig(config);
