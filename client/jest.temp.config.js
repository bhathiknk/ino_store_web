// jest.temp.config.js
module.exports = {
  ...require('./jest.config'), // Spread in existing configurations
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        outputPath: 'test-report.html',
        pageTitle: 'Test Report',
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
};
