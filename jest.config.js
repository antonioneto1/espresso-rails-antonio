module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  // moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // transform: {
  //   '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  // },
};
