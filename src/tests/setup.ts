// Mock Jest libraries
// See https://github.com/firebase/firebase-js-sdk/issues/5687#issuecomment-959975818
jest.mock('firebase/database', () => {
  return {
    getDatabase: jest.fn(),
  };
});
jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(),
  };
});
jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(),
    signInWithCustomToken: jest.fn(),
  };
});
