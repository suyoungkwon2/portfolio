import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AiSearchCaseStudy } from "./AiSearchCaseStudy";

describe("AiSearchCaseStudy", () => {
  it("lists the twelve chapters, in order, for the sidebar's chapter nav", () => {
    const { container } = render(<AiSearchCaseStudy />);

    const chapters = [...container.querySelectorAll<HTMLElement>("[data-chapter][id]")].map(
      (el) => el.dataset.chapter,
    );
    expect(chapters).toEqual([
      "01 Context",
      "02 Impact",
      "03 R&R",
      "04 User Problem",
      "05 Company’s Problem",
      "06 Define",
      "07 PoC Approach",
      "08 System Architecture",
      "09 A/B Test",
      "10 Integration",
      "11 Monitoring",
      "12 Business Impact",
    ]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "AI Search: Recovering Lost Revenue",
    );
  });

  it("lets the reader pick a query in the demo and a route in the flow diagram", () => {
    render(<AiSearchCaseStudy />);

    const demo = screen.getByRole("group", { name: "Choose a search to try" });
    const chips = [...demo.querySelectorAll("button")];
    expect(chips.map((c) => c.textContent)).toEqual([
      "cabageMisspelling",
      "ca bbageSpacing",
      "lettuceSynonym",
      "granma padanoForeign word",
    ]);
    expect(chips[0]).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(chips[2]);
    expect(chips[2]).toHaveAttribute("aria-pressed", "true");
    expect(chips[0]).toHaveAttribute("aria-pressed", "false");

    const milk = screen.getByRole("button", { name: "milk" });
    fireEvent.click(milk);
    expect(milk).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Results found, so AI is never called.")).toBeInTheDocument();
  });

  it("labels the hero device Before, then After", () => {
    render(<AiSearchCaseStudy />);
    expect(screen.getByText("Before")).toBeInTheDocument();
  });

  it("marks missing recordings with their asset id", () => {
    render(<AiSearchCaseStudy />);
    expect(screen.getByText("dashboard-pan")).toBeInTheDocument();
  });
});
