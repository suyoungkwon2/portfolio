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
      "03 Role and Responsibility",
      "04 User Problem",
      "05 Company’s Problem",
      "06 Define",
      "07 PoC Approach",
      "08 Search Flow",
      "09 A/B Test",
      "10 Integration",
      "11 Monitoring",
      "12 Business Impact",
    ]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "AI Search: Recovering Lost Revenue",
    );
  });

  it("lists the four query types in 04 and 07B, type above its example", () => {
    render(<AiSearchCaseStudy />);

    // 04 marks played tries with ❌, 07B with ✅; the first is played from the start.
    const lists = screen.getAllByRole("list", { name: "Four query types" });
    const chips = (list: HTMLElement) => [...list.querySelectorAll("li")].map((c) => c.textContent);
    expect(lists.map(chips)).toEqual([
      ["Misspellingcabage❌", "Spacingca bbage", "Synonymcole", "Foreign wordhalapeno"],
      ["Misspellingcabage✅", "Spacingca bbage", "Synonymcole", "Foreign wordhalapeno"],
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
