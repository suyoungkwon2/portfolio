import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the full headline text and a play/pause control", () => {
    render(<Hero />);

    const heading = screen.getByRole("heading", { level: 1 });
    // Each letter renders as its own span (for the scroll-disintegration
    // effect) and spaces are non-text spacer elements, so compare with
    // whitespace stripped rather than the literal heading string.
    expect(heading.textContent?.replace(/\s+/g, "")).toBe("HealtheWorld");

    expect(screen.getByRole("button", { name: /pause video|play video/i })).toBeInTheDocument();
  });
});
