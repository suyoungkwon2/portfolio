import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AiSearchCaseStudy } from "./AiSearchCaseStudy";

describe("AiSearchCaseStudy", () => {
  it("lists the chapters through 09, in order, for the sidebar's chapter nav", () => {
    const { container } = render(<AiSearchCaseStudy />);

    const chapters = [...container.querySelectorAll<HTMLElement>("[data-chapter][id]")].map(
      (el) => el.dataset.chapter,
    );
    expect(chapters).toEqual([
      "01 Context",
      "02 Impact",
      "03 Role and Responsibility",
      "04 User Problem",
      "05 Company’s Problem",
      "06 Define",
      "07 PoC Approach",
      "08 Search Flow",
      "09 A/B Test",
    ]);
    expect(screen.getByText(/coming soon/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "AI Search: Recovering Lost Revenue",
    );
  });

  it("lists the four query types in the demo, type above its example", () => {
    render(<AiSearchCaseStudy />);

    const types = screen.getAllByRole("list", { name: "Four query types" })[0];
    expect([...types.querySelectorAll("li")].map((c) => c.textContent)).toEqual([
      "✅\u00a0Misspellingcabage",
      "Spacingca bbage",
      "Synonymcole",
      "Foreign wordhalapeno",
    ]);
  });

  it("lets the reader pick a route in the flow diagram", () => {
    render(<AiSearchCaseStudy />);

    const milk = screen.getByRole("button", { name: "milk" });
    fireEvent.click(milk);
    expect(milk).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/legacy search finds results/)).toBeInTheDocument();
  });

  it("labels the hero device Before, then After", () => {
    render(<AiSearchCaseStudy />);
    expect(screen.getByText("Before")).toBeInTheDocument();
  });
});
