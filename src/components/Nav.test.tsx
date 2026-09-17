import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders the logo and all nav links", () => {
    render(<Nav />);

    expect(screen.getByText("Suyoung Mel Kwon")).toBeInTheDocument();
    for (const label of ["About", "Work", "Publication", "Resume"]) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        `#${label.toLowerCase()}`,
      );
    }
  });
});
