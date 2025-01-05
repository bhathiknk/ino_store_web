module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx'],
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!axios|react-toastify)',
        '\\.pnp\\.[^\\/]+$',
    ],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/fileMock.js',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },


};
