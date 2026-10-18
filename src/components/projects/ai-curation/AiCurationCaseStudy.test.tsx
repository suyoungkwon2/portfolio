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
      "improvement:11 Improvement",
      "integration-impact:12 Integration & Impact",
      "reflection:13 Reflection",
    ]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "AI Curation: Scaling Themed Campaigns",
    );
  });

  it("curates the matcha theme in the Copilot demo on Submit", async () => {
    render(<AiCurationCaseStudy />);
    const copilot = document.getElementById("copilot")!;
    expect(within(copilot).getByDisplayValue("Matcha Core: Trending Now")).toBeInTheDocument();

    fireEvent.click(within(copilot).getByRole("button", { name: "Submit" }));
    expect(
      await within(copilot).findByText(
        "8 products found for “Matcha Core: Trending Now”.",
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  });

  it("reveals the models after a blind pick", () => {
    render(<AiCurationCaseStudy />);
    const evaluation = document.getElementById("evaluation")!;
    const lists = within(evaluation).getAllByRole("button", { pressed: false });
    fireEvent.click(lists[1]);

    expect(lists[1]).toHaveAttribute("aria-pressed", "true");
    expect(
      within(evaluation).getByText("Kurly employees picked Model A 68% of the time."),
    ).toBeInTheDocument();
    expect(
      within(evaluation).getByText("Model A: our own algorithm built on GPT-4o · Your pick"),
    ).toBeInTheDocument();
  });

  it("answers “Can you tell?” once a campaign is picked", () => {
    render(<AiCurationCaseStudy />);
    const abTest = document.getElementById("ab-test")!;
    expect(within(abTest).queryByText("Customers couldn’t tell either.")).toBeNull();

    fireEvent.click(within(abTest).getByRole("button", { name: /Campaign 2: this one/ }));
    expect(within(abTest).getByText("Customers couldn’t tell either.")).toBeInTheDocument();
    expect(within(abTest).getByText("Picked by AI")).toBeInTheDocument();
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
