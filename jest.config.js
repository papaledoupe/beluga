module.exports = {
    setupFiles: ['<rootDir>/setupEnzyme.ts'],
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "(\\.|/)(test|spec)\\.tsx?$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    moduleNameMapper: {
        "\\.(css|less)$": "identity-obj-proxy"
    },
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.test.json"
        }
    }
};
