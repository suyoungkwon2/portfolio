import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SelectedWorks } from "./SelectedWorks";
import { works, workSectors } from "@/content/works";

describe("SelectedWorks", () => {
  it("renders every sector heading and one card per work item", () => {
    render(<SelectedWorks />);

    for (const sector of workSectors) {
      expect(screen.getByRole("heading", { level: 3, name: sector })).toBeInTheDocument();
    }

    const cardLinks = screen.getAllByRole("link").filter((link) =>
      link.getAttribute("href")?.startsWith("/work/"),
    );
    expect(cardLinks).toHaveLength(works.length);
  });
});
