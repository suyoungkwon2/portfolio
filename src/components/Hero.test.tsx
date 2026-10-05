import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("names every role in the headline and labels each photo", () => {
    const { container } = render(<Hero />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("I’m Mel, Product Manager, UX Designer, HCI Researcher, Master @ CMU");

    const stage = container.querySelector("[aria-hidden='true']")!;
    for (const role of ["Product Manager", "UX Designer", "HCI Researcher", "Master @ CMU"]) {
      expect(stage).toHaveTextContent(role);
    }
    expect(stage.querySelectorAll("img")).toHaveLength(4);
  });
});
