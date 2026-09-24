import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders the home logo, Resume, and About links", () => {
    render(<Nav />);

    expect(screen.getByRole("link", { name: "Suyoung Mel Kwon" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Resume" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
  });
});
