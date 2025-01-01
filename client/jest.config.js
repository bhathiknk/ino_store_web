module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx|mjs)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!axios|react-toastify)',
        '\\.pnp\\.[^\\/]+$',
    ],
    // Mocks out all these file formats when imported in tests
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/fileMock.js',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },


};
