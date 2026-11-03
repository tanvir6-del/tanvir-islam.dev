import '@testing-library/jest-dom';

// Mock IntersectionObserver for jsdom unit tests
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error mock IntersectionObserver
  window.IntersectionObserver = MockIntersectionObserver;
}
