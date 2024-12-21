module.exports = {
    setupFiles: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    coverageReporters: ['text', 'lcov'],
    testTimeout: 30000, // Increase timeout to 30 seconds

    collectCoverage: true,
    coverageDirectory: './coverage',
    reporters: [
        'default',
        ['jest-html-reporter', {
            pageTitle: 'Unit Tests and Integration Tests Coverage Report',
            outputPath: './coverage/Unit and Integration Tests Report.html',
        }],
    ],
};
