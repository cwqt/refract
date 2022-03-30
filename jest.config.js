module.exports = {
  moduleFileExtensions: ["js", "ts", "tsx"],
  testMatch: ["**/*.(test|spec).(ts|tsx)"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
      babelConfig: true,
    },
  },
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageReporters: ["json", "lcov", "text", "text-summary"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/mocks.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/mocks.js",
  },
  preset: "ts-jest",
};
