module.exports = {
    setupFiles: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    coverageReporters: ['text', 'lcov'],
    testTimeout: 30000,

};
