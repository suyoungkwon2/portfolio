import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SelectedWorks } from "./SelectedWorks";
import { works } from "@/content/works";

describe("SelectedWorks", () => {
  it("renders one card per work item, with no section heading", () => {
    render(<SelectedWorks />);

    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();

    const cardLinks = screen.getAllByRole("link").filter((link) =>
      link.getAttribute("href")?.startsWith("/work/"),
    );
    expect(cardLinks).toHaveLength(works.length);
  });
});
