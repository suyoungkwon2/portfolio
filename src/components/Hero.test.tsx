import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("names every role in the headline and shows the first one", () => {
    render(<Hero />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(
      "I’m Mel, Product Manager, UX Designer, HCI Researcher, Master @ CMU",
    );
    expect(screen.getByText("Product Manager", { selector: "span[class*='whitespace-nowrap']" })).toBeInTheDocument();
  });
});
