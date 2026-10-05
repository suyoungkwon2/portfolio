import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// jsdom doesn't implement these; Framer Motion (whileInView, useScroll) needs them.
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// jsdom has no WebGL, so Paper Shaders rejects on mount. The card backdrops
// already fall back to a CSS gradient; tests render that alone.
vi.mock("@paper-design/shaders-react", () => ({ MeshGradient: () => null }));
