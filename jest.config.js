module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^assets/(.*)$": "<rootDir>/assets/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/app-example/", "<rootDir>/node_modules/"],
};
