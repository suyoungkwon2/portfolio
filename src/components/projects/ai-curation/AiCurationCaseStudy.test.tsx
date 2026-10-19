import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AiCurationCaseStudy } from "./AiCurationCaseStudy";

describe("AiCurationCaseStudy", () => {
  it("lists the thirteen chapters, in order, for the sidebar's chapter nav", () => {
    const { container } = render(<AiCurationCaseStudy />);

    const chapters = [...container.querySelectorAll<HTMLElement>("[data-chapter][id]")].map(
      (el) => `${el.id}:${el.dataset.chapter}`,
    );
    expect(chapters).toEqual([
      "context:01 Context",
      "impact:02 Impact",
      "roles:03 Role and Responsibility",
      "user-problem:04 User Problem",
      "company-problem:05 Company’s Problem",
      "interview:06 Employee Interview",
      "define:07 Define",
      "copilot:08 Internal Copilot",
      "evaluation:09 Internal Evaluation",
      "ab-test:10 A/B Test",
      "integration-impact:11 Integration & Impact",
      "reflection:12 Reflection",
    ]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "AI Curation: Scaling Themed Campaigns",
    );
  });

  it("curates the matcha theme in the Copilot demo on Search", async () => {
    render(<AiCurationCaseStudy />);
    const copilot = document.getElementById("copilot")!;
    // The pinned walkthrough types the theme in on scroll; jsdom doesn't scroll.
    expect(within(copilot).getByLabelText("Theme Subject *")).toBeInTheDocument();
    expect(within(copilot).getByText("Type a theme")).toBeInTheDocument();

    fireEvent.click(within(copilot).getByRole("button", { name: "Search" }));
    expect(
      await within(copilot).findByText(
        "30 products found for “Matcha Core: Trending Now”.",
        {},
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();

    fireEvent.click(within(copilot).getByRole("button", { name: "Submit satisfaction" }));
    expect(
      within(copilot).getByText("Thanks, Suyoung Kwon. Rated 5/10 for this search."),
    ).toBeInTheDocument();
    expect(within(copilot).getByRole("button", { name: "CSV Download" })).toBeEnabled();

    // Kurly Now carries only some of them; Beauty has no matcha at all.
    fireEvent.click(within(copilot).getByRole("radio", { name: "Now" }));
    expect(
      within(copilot).getByText("12 products found for “Matcha Core: Trending Now”."),
    ).toBeInTheDocument();
    fireEvent.click(within(copilot).getByRole("radio", { name: "Beauty" }));
    expect(within(copilot).getByText("No products match.")).toBeInTheDocument();
  });

  it("sets the blind test's two models side by side on a plain and a reasoning theme", () => {
    render(<AiCurationCaseStudy />);
    const evaluation = document.getElementById("evaluation")!;
    expect(within(evaluation).getByText("“A cute home café”")).toBeInTheDocument();
    expect(within(evaluation).getByText("“Beer snacks, but no chicken”")).toBeInTheDocument();
    expect(within(evaluation).getByAltText("Spicy Squid Tempura")).toBeInTheDocument();
    expect(within(evaluation).getByAltText("Boneless BBQ Chicken")).toBeInTheDocument();
    expect(within(evaluation).getByText("Our algorithm won 68% of 56 votes.")).toBeInTheDocument();
  });

  it("says up front which group is the MD's and which is the AI's", () => {
    render(<AiCurationCaseStudy />);
    const abTest = document.getElementById("ab-test")!;
    expect(within(abTest).getByText("Picked by an MD")).toBeInTheDocument();
    expect(within(abTest).getByText("Picked by AI")).toBeInTheDocument();
    expect(within(abTest).queryByRole("button", { name: /picked by AI/ })).toBeNull();
  });

  it("labels staged and paraphrased material", () => {
    render(<AiCurationCaseStudy />);
    // 05's pinned scene shows one of its two quotes at a time.
    expect(
      screen.getAllByText("Paraphrased from interviews with the MD team.").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "The Sold Out and No Longer Sold labels are added to explain; the app doesn’t show them.",
      ).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Illustrative distribution. Average is actual.")).toBeInTheDocument();
  });
});
