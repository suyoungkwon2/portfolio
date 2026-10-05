import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";

const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

const tree = () => within(screen.getByRole("navigation", { name: "Site" }));

describe("Sidebar", () => {
  beforeEach(() => {
    nav.pathname = "/";
  });

  it("renders the logo home link and the top-level folders", () => {
    render(<Sidebar />);

    expect(screen.getAllByRole("link", { name: "Suyoung Mel Kwon, home" })[0]).toHaveAttribute("href", "/");
    expect(tree().getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
    expect(tree().getByRole("link", { name: "Resume" })).toHaveAttribute("href", "/resume");
    expect(tree().getByRole("link", { name: "Experience" })).toHaveAttribute("href", "/about/experience");
  });

  it("keeps nested folders closed until the visitor is inside them", () => {
    render(<Sidebar />);
    expect(tree().queryByRole("link", { name: "MARS" })).not.toBeInTheDocument();

    fireEvent.click(tree().getByRole("button", { name: "Expand Research" }));
    expect(tree().getByRole("link", { name: "MARS" })).toHaveAttribute("href", "/work/mars");
  });

  it("opens the current project's folder and marks only that row", () => {
    nav.pathname = "/work/mars/";
    render(<Sidebar />);

    expect(tree().getByRole("link", { name: "MARS" })).toHaveAttribute("aria-current", "page");
    expect(tree().getByRole("link", { name: "Research" })).not.toHaveAttribute("aria-current");
  });

  it("marks Hello Visitor, not the About folder, on /about", () => {
    nav.pathname = "/about";
    render(<Sidebar />);

    expect(tree().getByRole("link", { name: "Hello Visitor" })).toHaveAttribute("aria-current", "page");
    expect(tree().getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
  });
});
