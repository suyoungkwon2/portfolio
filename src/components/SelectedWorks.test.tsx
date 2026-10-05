import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SelectedWorks } from "./SelectedWorks";
import { featuredSlugs } from "@/content/works";

describe("SelectedWorks", () => {
  it("renders the Selected Projects heading and one card per featured project", () => {
    render(<SelectedWorks />);

    expect(screen.getByRole("heading", { level: 2, name: "Selected Projects" })).toBeInTheDocument();

    const workLinks = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"))
      .filter((href) => href?.startsWith("/work/"));
    expect(workLinks).toEqual(featuredSlugs.map((slug) => `/work/${slug}`));
  });
});
